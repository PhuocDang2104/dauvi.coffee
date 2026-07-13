export default function ShopLoading() {
  return (
    <main id="main-content" className="shell section-space" aria-busy="true">
      <div className="h-14 max-w-3xl animate-pulse rounded-2xl bg-paper-100" />
      <div className="mt-14 grid gap-8 lg:grid-cols-[17rem_1fr]">
        <div className="hidden h-[38rem] animate-pulse rounded-3xl bg-paper-100 lg:block" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-[34rem] animate-pulse rounded-3xl bg-paper-100" />)}
        </div>
      </div>
    </main>
  );
}
