import { useEffect, useState } from 'react';
import { LLMEvaluator, type MLXOptions } from './LLMEvaluator';

/**
 * Hook for easily using MLX in React components
 *
 * @example
 * ```tsx
 * const llm = useMLX({
 *   model: "llama-3.2",
 *   context: "...",
 *   systemPrompt: ""
 * })
 *
 * await llm.generate(prompt)
 * console.log(llm.response)
 * ```
 */
export function useLLMEvaluator(options: MLXOptions) {
  const [instance] = useState(() => new LLMEvaluator());
  const [, setIsLoading] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: not needed
  useEffect(() => {
    const loadModel = async () => {
      setIsLoading(true);
      try {
        await instance.load(options);
      } catch (error) {
        console.error('Error loading MLX model:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadModel();

    // Set up listeners for state changes
    const stateListener = instance.addEventListener('onStateChange', () => {
      // State is already updated in the instance
    });

    return () => {
      instance.removeEventListener(stateListener);
    };
  }, [options.model]);

  return instance;
}
