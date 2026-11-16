# vLLM KV Connector 调度流程

基于 vLLM v0.30.0 / vLLM-Ascend v0.30.0

Scheduler 何时调用 Connector？Worker 收到计划后，Model Runner V2 又从哪里启动传输？沿调用顺序看完一轮执行，再看 P/D 如何交接 KV，以及 AscendStore 如何保存前缀。

1. [Scheduler 与 KV Connector](01-scheduler.md)：从一次前缀命中看 blocks 分配、计划派发和结果回写。
2. [Model Runner V2 的 KV 加载与保存](02-runner-v2.md)：沿一层 attention 看 KV 加载和保存时谁在等待。
3. [P/D 分离中的 KV 交接](03-async-load.md)：P 端保留源 blocks，D 端异步读取并发回确认。
4. [AscendStore 的 KV 保存与复用](04-save-and-reuse.md)：查询共享池、在 forward 前加载前缀、计算后保存 KV。

[网页版本](index.html)
