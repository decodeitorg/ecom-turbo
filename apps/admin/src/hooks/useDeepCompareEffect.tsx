import { useEffect, useRef } from "react";
import isEqual from "lodash.isequal";

// Generic type for dependencies
type DependencyList = ReadonlyArray<unknown>;

function useDeepCompareEffect(
    callback: () => void | (() => void | undefined), // Effect callback
    dependencies: DependencyList // Dependency array
): void {
    const previousDepsRef = useRef<DependencyList | undefined>(undefined);

    if (!isEqual(previousDepsRef.current, dependencies)) {
        previousDepsRef.current = dependencies;
    }

    useEffect(callback, [previousDepsRef.current]);
}

export default useDeepCompareEffect;
