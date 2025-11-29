---
title: "An Intuitive Guide to Optimizers"
date: "2025-11-28"
category: "Training"
author: "Few Shot Learners"
excerpt: "A comprehensive introduction to classic optimizers"
---

## Introduction

This blog will discuss **optimizers**, building up from first principles and walking through the evolution and development of optimizers.

## Optimizer?

Feel free to skip this section if familiar with the basics at a high level, e.g. what is a loss function, what is an optimizer, etc. (If you know that our goal in training a neural network is to minimize $L(\theta)$ then you should probably skip this section or spend ~15 seconds skimming it).

**Brief** In this blog, we'll represent a model as a parameter matrix $\theta$, inputs to the model as a vector $X$, and desired outputs as a vector $y$. Then "running a model" on inputs $X$ will mean predicting some $y_hat = \theta X$, and our ultimate goal in "training a model" is to find the parameters $\theta$ that lead to the best $y_hat$ the most consistently. Since we want to find the "best $y_h$", we need some way to quantify "how wrong" we are: the loss function $L$, which will compute some measure of how wrong we are based on the predicted outputs and the true outputs. We can represent $L$ as a function of $\theta$ quite naturally, and so our goal in training boils down to $\min_\theta L(\theta)$. This is an incredibly simple approximation of most neural networks but will serve as the running example throughout the blog for simplicity's sake.

In practice, $L(\theta)$ a quite complex function: rarely convex and often depends on millions of parameters, and as a result, we can’t solve it analytically. Instead, it is common practice to **iteratively update** $\theta$ based on our training examples, across many steps, until it converges on what we think is the most optimal $\theta$. Optimizers are just the method and techniques we use to update $\theta$. 

---
## SGD (Stochastic Gradient Descent)

Think of the loss $L(\theta)$ geometrically as a weird, crumpled landscape in very high dimensions. Each point in this landscape will then correspond to a particular choice of $\theta$ (and geometrically, the height represents the loss value).

If you're familiar with gradients/derivates (which you should be), the gradient $\nabla_\theta L(\theta)$ is a vector pointing in the direction of steepest ascent (the direction that increases the loss the fastest). So naturally, since we want to decrease the loss, we should move in the opposite direction: giving us steepest descent.

SGD can be though of simply as “look at where the slope is steepest and take a small step downhill.”

Mathematically:
- Let $g_t = \nabla_\theta L(\theta_{t-1})$ be the gradient of the loss at the current parameters.
- Let $\alpha > 0$ be the learning rate, which just controls how big a step we take.

Then the update is:
$\theta_t = \theta_{t-1} - \alpha\, g_t.$

So each iteration, we first
1. Compute gradient $g_t$, then
2. Step in the negative gradient direction, scaled by $\alpha$.

This is a simple way to find the lowest point in the loss landscape, hence minimizing loss. As a quick note: in practice, we don’t compute the gradient on the full dataset every time, as it's too slow. Instead, we compute it on "mini-batches" hence the “stochastic” in SGD. But the basic idea is the same.

### Problems with plain SGD

Although SGD makes sense, there are some issues:

Each update only uses the current gradient $g_t$. There’s no notion of “overall direction” across time. This is the primary problem that we can visualize with the help of an example loss landscape. Suppose our loss landscape resembles a long, narrow valley. Towards the bottom, the gradient might point in alternating directions after each update as we bounce from side to side of the valley because of the step size. This leads to $\theta$ never converging, or converging at a point which isn't the global minimum. We can reduce the learning rate, but this brings rise to other problems which will be discussed later (one of which is just being too slow).

Also, every parameter in $\theta$ uses the same $\alpha$ (although $\theta$ is our parameter vector, each element of it can be thought of to represent a different parameter). This can be a problem, since different parameters may have gradients with very different magnitudes, or live on different scales. We may want to update some parameters minimally, while others could need larger steps, which a single global $\alpha$ doesn't account for.

The point is, SGD treats all parameters the same way, when each parameter may need its own effective learning rate, evolving over time based on how its gradients behave. For example, we want parameters with large & frequent gradients to take smaller steps to avoid overshooting, and parameters with small & rare gradients to take larger steps so they can still learn.

This leads naturally to **AdaGrad**.

---

## AdaGrad (2011)

### Core idea

AdaGrad gives each parameter its own adaptive learning rate based on how large its past gradients have been.

To implement this, for each parameter $i$ in $\theta$, we keep track of the sum of its past squared gradients:

$v_{t,i} = v_{t-1,i} + g_{t,i}^2$,

where:
- $g_{t,i}$ is the gradient of the loss with respect to parameter $\theta_i$ at step t,
- and $v_{t,i}$ starts at 0 and monotonically increases.

Then the update becomes:
$\theta_{t,i} = \theta_{t-1,i} - \frac{\alpha}{\sqrt{v_{t,i}} + \epsilon}\, g_{t,i},$

where $\epsilon$ is a tiny constant to avoid division by zero.

How does this actually help? Looking at the equation, we can clearly see that if a parameter has seen large gradients repeatedly, its $v_{t,i}$ grows large. As a result, the denominator $\sqrt{v_{t,i}}$ becomes big, and the effective learning rate $\alpha / (\sqrt{v_{t,i}} + \epsilon)$ becomes small. On the contrary, if a parameter has seen small or rare gradients, then $v_{t,i}$ stays small, the denominator stays small, and the effective learning rate stays relatively large.

We can see how this can be powerful with the example of a sparse setting (like NLP with large vocab sizes). Common words like “the” will get gradients all the time, so their corresponding parameters get heavily scaled down (small learning rate). Rare words get gradients only occasionally, so their parameters keep a larger learning rate and they can still move meaningfully when they finally get updated.

AdaGrad effectively normalizes each parameter’s step size by the magnitude of its historical gradients.

But I'm sure you see the issue here. $v_{t,i}$ is a cumulative sum, monotonically growing ($v_{t,i} = \sum_{k=1}^t g_{k,i}^2.$) So as training goes on, $\sqrt{v_{t,i}}$ keeps increasing, $\alpha / (\sqrt{v_{t,i}} + \epsilon)$ keeps **shrinking**, and eventually, the steps become so tiny that learning basically stops.

AdaGrad addresses our problems early on, but over very long training runs, learning dies.

So we want to preserve the idea of per-parameter adaptive learning rates, but we don’t want them to decay to zero permanently.

Naturally, we need a way to track “recent” gradient magnitudes without letting the history grow unbounded. A straightforward solution is to replace the cumulative sum with a moving average, which is the core idea of RMSProp.

---
## RMSProp (2012)

RMSProp modifies AdaGrad by replacing the infinitely growing sum with an exponential moving average (EMA) of squared gradients.

In the equation, instead of:

$v_{t} = v_{t-1} + g_t^2,$

we use:

$v_t = \beta v_{t-1} + (1 - \beta)\, g_t^2,$

where $0 < \beta < 1$. The update rule becomes:

$\theta_t = \theta_{t-1} - \frac{\alpha}{\sqrt{v_t} + \epsilon}\, g_t.$

The only difference here is replacing the sum with the EMA, which is essentially a running average that favors recent values. Examining the equation makes this clear; if recent gradients are large, $v_t$ becomes large, and if recent gradients are small, $v_t$ decays back down.

This fixes the issue of decaying learning rate in AdaGrad, so we have the per-parameter steps but the denominator no longer grows unbounded.

What's still missing, then? RMSProp still has a few issues. It adapts step sizes, but the issue is again, what happens at the bottom of the valley? We still have the potential issue of bouncing from side to side. We scale the step size, but don't account for the direction.

The solution to this is to accumulate a direction of travel across iterations, as we will see in Adam with the concept of momentum.

Another issue is that early in training, $v_t$ starts near zero. Because we initialize $v_0 = 0$, the first few steps of the EMA are biased toward zero. That means the denominator $\sqrt{v_t}$ can be too small at the beginning, our early effective learning rate becomes too large, and we begin with unstable jumps. This can be mitigated through a concept called bias correction.

The addition of momentum and bias correction naturally lead to the next iteration of optimizers: Adam *Footnote: Who is Adam?*

---

## Adam

As mentioned, we now want to add two missing pieces: **momentum** to accumulate a direction of travel across steps so we don’t jitter around at the bottom of valleys, and **bias correction** to fix the early behavior of EMAs so our adaptive scaling isn’t unreasonable at the beginning. Note that we still want to keep the adaptive step size scaling part of RMSProp.

We'll first lay out the update equations and explain them more clearly afterward, so we can work with the concrete expressions:

Let $g_t = \nabla_\theta L(\theta_{t-1})$ as usual. Adam keeps track of two moving averages:

$$\begin{aligned} m_t &= \beta_1 m_{t-1} + (1 - \beta_1)\, g_t \quad &&\text{(EMA of gradients, 1st moment)} \\ v_t &= \beta_2 v_{t-1} + (1 - \beta_2)\, g_t^2 \quad &&\text{(EMA of squared gradients, 2nd moment)} \end{aligned}$$

with typical values like $\beta_1 = 0.9, \beta_2 = 0.999,$ and $m_0 = 0, v_0 = 0.$

These are then bias-corrected as follows:
$$\hat{m}_t = \frac{m_t}{1 - \beta_1^t}, \qquad \hat{v}_t = \frac{v_t}{1 - \beta_2^t}.$$
and the final update is:
$$\theta_t = \theta_{t-1} - \alpha \frac{\hat{m}_t}{\sqrt{\hat{v}_t} + \epsilon}.$$

As a reminder from statistics, the first moment (about zero) is just the mean, and the second moment is the mean of the squared values. So $m_t$ is the running mean of gradients, telling us on average which way gradients have been pointing recently, and $v_t$ is the running mean of squared gradients, telling us on average how large have gradients been recently. This is why they're called the first and second moments.

This is likely clear by now, but we see if gradients keep pointing roughly in the same direction, $m_t$ will line up with that direction and grow in magnitude. If gradients are noisy or change direction frequently, $m_t$ dampens that noise and gives us a more stable direction than the raw $g_t$. Hence we develop momentum, a smoothed velocity vector in parameter space. And $v_t$ plays the same role it did in RMSProp; keeping track of the magnitude of past gradients, per parameter, so we can scale each parameter’s step size appropriately.

If the bias correction is clear, feel free to skip the following brief section. We take a quick example to show how it helps.

Initialize $m_0 = 0$ and $v_0 = 0$.

Suppose $\beta_1 = 0.9$. On step 1 we then have:

$m_1 = 0.9 \cdot 0 + 0.1 g_1 = 0.1 g_1$.

But if we think about what a “true” running mean of gradients would be after 1 step, it should just be $g_1$, not $0.1 g_1$.The EMA is biased toward zero early on because we started at 0. The same goes for $v_t$. To mitigate, we'd like to divide what we currently have by 0.1.

The bias-corrected versions

$$\hat{m}_t = \frac{m_t}{1 - \beta_1^t}, \quad \hat{v}_t = \frac{v_t}{1 - \beta_2^t}$$

are basically saying given that we started from zero and have only taken t steps, what would this EMA look like if we hadn’t started from zero? When $t=0$, $1 - \beta_1^t = 0.1$ and we divide by 0.1, removing the bias. Then as $t$ grows, $1 - \beta_1^t \to 1$, so the correction fades away. But as we can see, in the first few steps, it’s useful for not exploding the early learning rate.

Effectively, Adam is RMSProp with momentum and bias correction. We preserve the adaptive step sizes but gain smoother motion through momentum and perform correct updates from the beginning.

We seem to have addressed all the issues, which is why, for a while, the default optimizer to use was Adam.

Adam, however, is not without its flaws. One important case which is hard to intuitively see is how it interacts with weight decay / L2 regularization.

#### What is weight decay?

Weight decay is quite simple and is a way to regularize the model by nudging parameters toward zero, preventing them from growing arbitrarily large and overfitting. We simply add an L2 norm.

$L’(\theta) = L(\theta) + \frac{\lambda}{2}\|\theta\|^2,$

This factors in the weights themselves to the loss function, and adds a penalty which depends on the magnitude of the weight vector, encouraging us to keep the weights small.

You may now begin to see the issue. As a quick preview to AdamW, in the standard approach (the equation above), we compute the gradient

$\nabla_\theta L’(\theta) = \nabla_\theta L(\theta) + \lambda \theta,$

and feed this total gradient into Adam. But this means the term $\lambda \theta$ (intended to be weight decay) will also get mixed into $m_t$, mixed into $v_t$, and then scaled by $1 / \sqrt{\hat{v}_t}$. Weight decay no longer behaves as a clean “shrink weights toward zero” operation; it becomes super entangled with the adaptive scaling. We fix this with the incredibly popular and modern optimizer AdamW.

---
## AdamW

In an ideal world, if we had SGD with weight decay, we’d update like:

$\theta_t = \theta_{t-1} - \alpha g_t - \alpha \lambda \theta_{t-1}$

which can be rearranged as:

$\theta_t = (1 - \alpha \lambda)\,\theta_{t-1} - \alpha g_t.$

This is uniform shrinkage, where every parameter is pulled toward zero by the same multiplicative factor, independent of its gradient history. We actually want to preserve this behavior, even in adaptive optimizers, to ensure we're not letting any weights grow disproportionately.

However, when we add $\frac{\lambda}{2}\|\theta\|^2$ to the loss and take the gradient, we get:

$g_t’ = \nabla_\theta L(\theta_{t-1}) + \lambda \theta_{t-1}$.

We then plug $g_t’$ into Adam:  

$\theta_t = \theta_{t-1} - \alpha \frac{\hat{m}_t’ }{\sqrt{\hat{v}_t’} + \epsilon},$

where both $\hat{m}_t’$ and $\hat{v}_t’$ now depend on the sum of the original gradient and the $\lambda \theta$ term. The weight decay term contributes to everything.  Why is this bad? Parameters with large historical gradients (large $\hat{v}_t$) will have their decay term heavily scaled down, leading to less effective weight decay, and the opposite effect occurs on parameters with small historical gradients. In this case, weight decay becomes dependent on gradient statistics, distorting the geometry of regularization.

AdamW’s key contribution is to _decouple_ the weight decay from the rest of the update, by doing the Adam gradient update without weight decay, then applying the decay step separately.

AdamW mathematically becomes:

$$\theta_t’ = \theta_{t-1} - \alpha \frac{\hat{m}_t}{\sqrt{\hat{v}_t} + \epsilon} ~\text{(learning step)}$$

$$\theta_t = \theta_t’ - \alpha \lambda \theta_{t-1} ~\text{(weight decay step)}$$

Notice the update uses only $\nabla_\theta L(\theta)$ (through $m_t$ and $v_t$), and doesn't use $\lambda \theta$, and the decay step uses only $\theta_{t-1}$. You’ll often see this simplified as:

$$\theta_t = \theta_{t-1} - \alpha \frac{\hat{m}_t}{\sqrt{\hat{v}t} + \epsilon} - \alpha \lambda \theta{t-1}.$$
---
### Conclusion

Optimizers are a clean way to make the theoretical concepts of gradient descent more practical and workable in production. Over the course of this blog, we'll continue to use many of the optimizers introduced above, along with some more complicated variants that we'll introduce later (Muon blog coming soon!).
