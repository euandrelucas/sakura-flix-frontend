import { RateLimiterMemory } from "rate-limiter-flexible";

const limiter = new RateLimiterMemory({
  points: 5, // 5 requisições
  duration: 60, // por 60 segundos
});

export default limiter;
