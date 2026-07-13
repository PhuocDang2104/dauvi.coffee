export default function Loading() {
  return (
    <main id="main-content" className="shell section-space" aria-busy="true" aria-label="Đang tải trang">
      <div className="h-4 w-36 animate-pulse rounded-full bg-sand-200" />
      <div className="mt-6 h-16 max-w-2xl animate-pulse rounded-2xl bg-paper-100" />
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-96 animate-pulse rounded-[1.5rem] bg-paper-100" />
        ))}
      </div>
    </main>
  );
}
