import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box, BoxProps } from "@mui/material";

interface ChartWrapperProps extends Omit<BoxProps, "children"> {
  children: React.ReactNode;
  height?: number | string;
  width?: number | string;
  retryDelay?: number;
  maxRetries?: number;
}

export default function ChartWrapper({
  children,
  height = 250,
  width = "100%",
  retryDelay = 150,
  maxRetries = 3,
  ...boxProps
}: ChartWrapperProps) {
  const [isReady, setIsReady] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const observerRef = useRef<ResizeObserver>();

  // Cleanup function
  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = undefined;
    }
  }, []);

  // Initialize chart when container is properly sized
  const initializeChart = useCallback(() => {
    if (!containerRef.current) return;

    const { width: containerWidth, height: containerHeight } =
      containerRef.current.getBoundingClientRect();

    // Check if container has valid dimensions
    if (containerWidth > 0 && containerHeight > 0) {
      setIsReady(true);
      cleanup();
      return;
    }

    // Retry if we haven't exceeded max attempts
    if (retryCount < maxRetries) {
      timeoutRef.current = setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        initializeChart();
      }, retryDelay);
    } else {
      // Force ready state after max retries
      console.debug("ChartWrapper: Max retries reached, forcing ready state");
      setIsReady(true);
      cleanup();
    }
  }, [retryCount, maxRetries, retryDelay, cleanup]);

  // Set up ResizeObserver for responsive behavior
  const setupResizeObserver = useCallback(() => {
    if (!containerRef.current || !window.ResizeObserver) return;

    try {
      observerRef.current = new ResizeObserver((entries) => {
        // Use requestAnimationFrame to prevent loops
        requestAnimationFrame(() => {
          try {
            for (const entry of entries) {
              const { width: observedWidth, height: observedHeight } =
                entry.contentRect;

              // Only trigger re-initialization if dimensions are valid
              if (observedWidth > 0 && observedHeight > 0 && !isReady) {
                setIsReady(true);
              }
            }
          } catch (error) {
            // Silently handle errors - no console output
          }
        });
      });

      observerRef.current.observe(containerRef.current);
    } catch (error) {
      // Silently handle errors and fallback to timer-based initialization
      initializeChart();
    }
  }, [isReady, initializeChart]);

  // Initial setup effect
  useEffect(() => {
    // Small delay to ensure DOM is ready
    timeoutRef.current = setTimeout(() => {
      setupResizeObserver();
      initializeChart();
    }, 50);

    return cleanup;
  }, [setupResizeObserver, initializeChart, cleanup]);

  // Global error handler for ResizeObserver errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const isResizeObserverError = event.message.includes("ResizeObserver");

      if (isResizeObserverError) {
        event.preventDefault();
        console.debug("ChartWrapper: ResizeObserver error handled");

        // Reset and retry with a delay
        setIsReady(false);
        setRetryCount(0);

        setTimeout(() => {
          setIsReady(true);
        }, retryDelay);
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (
        event.reason instanceof Error &&
        event.reason.message.includes("ResizeObserver")
      ) {
        event.preventDefault();
        console.debug("ChartWrapper: ResizeObserver promise rejection handled");
      }
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
    };
  }, [retryDelay]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return (
    <Box
      ref={containerRef}
      sx={{
        width,
        height,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...boxProps.sx,
      }}
      {...boxProps}
    >
      {isReady && (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {children}
        </Box>
      )}
      {!isReady && retryCount >= maxRetries && (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "text.secondary",
            fontSize: "0.875rem",
          }}
        >
          Chart loading...
        </Box>
      )}
    </Box>
  );
}
