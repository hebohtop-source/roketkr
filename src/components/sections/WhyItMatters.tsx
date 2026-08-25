export function WhyItMatters() {
  return (
    <section
      className="relative flex flex-col items-center justify-center text-center rounded-2xl px-6 py-10 gap-6 min-h-[300px] sm:px-10 sm:py-12 sm:gap-8 md:px-[60px] md:py-[60px] md:gap-8 md:min-h-[500px]"
      style={{
        background: "url('/matters-banner.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h2 className="font-manrope font-bold text-white text-3xl leading-tight sm:text-4xl md:text-5xl md:leading-[68px]">
        Почему это важно
      </h2>
      <p className="font-manrope font-medium text-white text-center text-base leading-relaxed sm:text-lg md:text-2xl md:leading-[33px] max-w-[1280px]">
        Оформление изменений обязательно для законной эксплуатации автомобиля.{" "}
        Мы берём процесс на себя и сопровождаем клиента до получения официальных документов.
      </p>
    </section>
  )
}
