# vLLM KV cache 分组机制

基于 vLLM `releases/v0.33.0` 与 vLLM-Ascend `releases/v0.33.0rc`。Worker 使用 Model Runner V2。

从 PagedAttention 的 block 读写出发，理解 Full 和 SWA 为什么要分组。

## 通用机制

1. [为什么要给 KV cache 分组](01-grouping-basics.md)

   看懂 `block table`、`KVCacheSpec` 和 Worker 收集 cache entry 的过程。
