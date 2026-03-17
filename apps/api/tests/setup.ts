/**
 * NOTE: This file is no longer referenced as a Vitest setupFile.
 *
 * Container lifecycle (start → migrate → seed → teardown) is now handled by
 * tests/global-setup.ts via Vitest's `globalSetup` option, which ensures the
 * container runs for the ENTIRE test suite rather than per–test-file.
 *
 * Signal handlers (SIGTERM / SIGINT) for interrupted cleanup are registered
 * directly in tests/global-setup.ts's teardown closure and by Testcontainers'
 * Ryuk sidecar container.
 *
 * This file is kept as documentation of the previous approach.
 */
