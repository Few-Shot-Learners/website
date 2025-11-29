---
title: "Understanding Attention"
date: "2025-11-28"
category: "Architecture"
author: "Few Shot Learners"
excerpt: "A comprehensive introduction to the attention mechanism"
---

## Introduction

Hello! This blog will discuss **attention**, the foundational computation pattern used in transformers and LLMs. This discussion will be particularly limited to variants of attention introduced in Attention is All You Need (Vaswani et. al.), including self-attention, causal self-attention, cross-attention, and multi-head attention. If you're interested in further variants of the attention mechanism (of which there are many), check out our other blog posts on those (coming soon!).

## The Why of attention

Now, attention is a reasonably intuitive concept, but to fully grasp its nuances it becomes relevant to understand its motivation, and therefore its history. As mentioned in the introduction, attention was a concept originally introduced by Vaswani et al in their landmark paper, Attention is All You Need. This paper particularly focused on attention as a mechanism in the "transformer," a model architecture that was originally used for machine translation, but is now most notaby adapted for use in generative models like the GPT series and DiTs.

There are a few precursors to the transformer architecture, but the one we'll be focusing on are the Recurrent Neural Network (RNN). Note that it would be incorrect to state that these architectures have been *replaced* by transformers — rather, they've found their use further restricted to certain problems that they are particularly suited to.

### The RNN
The RNN was one of the foundational model architectures introduced in the 80s-90s. The architecture was originally defined to handle time-series data, where you have a series of events that are passed into the model sequentially. This is notably distinct from the more classic DNN architectures, which operates on your single input vector (though, you could of course encode multiple events into this vector). The RNN architecture can be reduced to the following update rule:

$$\tanh(W_x x_t + W_h h_{t-1} + b)$$

Let's break this down. For each timestep $t$, the RNN will update its hidden state vector $h_t$ using the current input $x_t$ and the previous hidden state $h_{t-1}$. $W_x$ and $W_h$ are trainable weight matrices, and $b$ is a trainable bias vector. The final $\tanh$ function is a nonlinear activation function.

Put simply, the RNN maintains a hidden state representation of all past events it has seen. As it reads in new input tokens, it updates this hidden state, with the final hidden state being the model output. You can, of course, have an additional layer operating on the hidden state to get a final model output, but we're introducing the most basic RNN iteration here.

Now, the RNN has a few shortcomings. First, having the original tokens go through so many transforms before reaching the final output means that its gradient can either vanish or explode, based on the weights of the model. A similar problem is that RNNs tend to lack long-term memory, with the impact of more recent tokens overwriting the impact of older ones. There was a lot of work done in optimizing away some of these problems, the most notable being the LSTM (Long Short-Term Memory) variant of the RNN. This LSTM architecture augmented the existing RNN with more granular control over what to remember, what to forget, and what to output at each timestep.

## Self-Attention
Now, let's talk self-attention. At a high level, the goal of self-attention is to process each input token in the context of all the other tokens. What that means mathematically is that we have a query vector representing the token of interest, and a key and value vector for every other token in the sequence. We then use these vectors in the following operation, defined as scaled dot-product attention.

**Note**: These "vectors" actually become matrices, because we perform this operation for all tokens in the sequence at the same time. Also, many attention operations will also introduce more dimensions into these matrices, representing batches, heads, groups, etc. However, the core attention operation persists through these changes.

$$\text{Attention}(Q, K, V) = \text{softmax}(\frac{Q K^T}{\sqrt{d_k}}) V$$

Let's break this down. The first operation to look at is the $Q K^T$ matrix multiplication. This operation can be understood as calculating an attention score, codifying how much we care about some token $j$ when looking at token $i$. In this lens, the output of that operation will be a matrix $A$ where $A_{i, j}$ is the aforementioned attention score. We then scale this matrix down by a factor of $\sqrt{d_k}$, where $d_k$ is the dimensionality of your key vector. Without this scaling, the attention scores in our matrix become problematically high, leading to a very saturated softmax output (either close to 0 or 1) and vanishing gradients through the softmax. We then apply a softmax to convert our scaled scores into a probability distribution, which enables us to appropriate scale our values. Finally, we perform another matrix multiplication by $V$. We can consider this $V$ matrix to encode what the information content of token $j$ is. This matrix multiplication then weights these values using the softmaxed attention scores, giving us a clean way to create representations of each token within their surrounding contexts.

**Note**: This attention computation is usually followed by a trainable linear projection layer to some output dimension. This layer is sometimes included as part of the attention mechanism, but we've chosen to omit it for clarity.

When attention was first introduced, it offered a few key benefits over the LSTM-variant RNN. Unlike the RNN, which handles inputs in a sequential manner, attention works by reconciling all connections between simultaneously, meaning that you have more parallelizable inference. Since it doesn't intrinsically down-weight the attention that farther tokens receive, long-range dependencies can be more readily modeled, without having to operate through greatly diminished gradients.

One other useful property of attention is its ability to not only look at past tokens but also future ones — this is in contrast to autoregressive models, which can only focus on past tokens. This is a particularly interesting property to discuss because it is actually removed from most variants of attention used in generative language models.

### Causal Self-Attention
This leads us to our first variant of self-attention, causal self-attention. Causal self-attention is simple. It simply changes the attention score matrix to only care about previous tokens, not future ones. This is a helpful concept for generative models, where inference would involve predicting the next token in sequence only using previous tokens. If we tried to apply bidirectional (non-causal) attention to a generative model, the model would essentially be "cheating" during training by looking ahead at future tokens.

Causal self-attention works by applying a binary mask to the attention score matrix before they're passing into the softmax operation. This operation looks like this:

$$
\begin{bmatrix}
s_{11} & s_{12} & s_{13} & s_{14} & s_{15} \\
s_{21} & s_{22} & s_{23} & s_{24} & s_{25} \\
s_{31} & s_{32} & s_{33} & s_{34} & s_{35} \\
s_{41} & s_{42} & s_{43} & s_{44} & s_{45} \\
s_{51} & s_{52} & s_{53} & s_{54} & s_{55} \\
\end{bmatrix}
\quad
\Longrightarrow
\quad
\begin{bmatrix}
s_{11} & -\infty & -\infty & -\infty & -\infty \\
s_{21} & s_{22} & -\infty & -\infty & -\infty \\
s_{31} & s_{32} & s_{33} & -\infty & -\infty \\
s_{41} & s_{42} & s_{43} & s_{44} & -\infty \\
s_{51} & s_{52} & s_{53} & s_{54} & s_{55} \\
\end{bmatrix}
$$

We replace the unwanted values with $-\infty$, because this will resolve to 0 after getting exponentiated in the softmax operation ($e^{-\infty}=0$).

### Cross Attention
Now, let's talk about cross attention. This is an attention variant used in the original transformer paper, but notably not in the GPT-series or any other generative model. Because its not used much in LLMs, which is the current focus of this page as a whole, we'll move through this variant quickly. If you want to learn more about how it is used, check out the original transformer paper or one of its many in-depth walkthroughs. Cross attention operates in contrast to the *self* part of self-attention. Instead of getting your key and value matrices $K$ and $V$ from the same sequence that you get your $Q$ from, you instead get it from a different sequence. This is helpful for machine translation tasks, where you have an encoded input sequence, and want to cross-reference that when generating your decoded output sequence.

## Multi-Head Attention (MHA)
Finally, we can move to our final variant of attention, multi-head attention. Put simply, multi-head attention involves multiple iterations of the self-attention operation being performed in parallel, with their outputs being concatenated before being fed into the output linear projection layer. This allows each one of the heads to learn multiple representation subspaces or "perspectives" of the sequence at the same time, and use them in conjunction.

As we discussed earlier, this simply exhibits itself as an additional "head" dimension in the $Q$, $K$, and $V$ matrices, over which a batched matrix multiplication occurs. After passing through the output linear layer (which will have an input dimension of $\text{n\_heads}*d_V$ where $d_V$ is the embedding dimension of the value matrix), the model output is equivalent in size to a normal self-attention's output. However, this output now contains a transform of multiple attention representations, instead of just one.

## Conclusion
Having introduced MHA, we've now reached the end of the attention variants introduced in the original transformer paper. It is important to note that there have been many more attention variants introduced since (coming soon to FewShotLearners!). It is also important to understand how this attention layer fits into a larger language model. As you may assume, attention alone is not enough for such a model — only with accompanying layers that normalize and transform does it yield acceptable performance. A good next step for this exploration is our article on gigaChat, our adaptation of the GPT-2 architecture (coming soon!).