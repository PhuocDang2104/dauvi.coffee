export default function ProductLoading() {
  return (
    <main id="main-content" className="shell grid gap-10 py-12 lg:grid-cols-[1.18fr_.82fr]" aria-busy="true">
      <div className="h-[42rem] animate-pulse rounded-[1.8rem] bg-paper-100" />
      <div><div className="h-4 w-36 animate-pulse rounded bg-paper-100" /><div className="mt-5 h-28 animate-pulse rounded-2xl bg-paper-100" /><div className="mt-6 h-[30rem] animate-pulse rounded-3xl bg-paper-100" /></div>
    </main>
  );
}
