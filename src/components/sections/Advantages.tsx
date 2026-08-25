export const Advantages = () => {
  const ADVANTAGES = [
    {
      imageUrl: "/Image1.png",
      title: "Собственный склад",
      desc: "Всё в наличии. Без ожидания.",
    },
    {
      imageUrl: "/Image2.png",
      title: "Прямые поставки",
      desc: "Без посредников и переплат.",
    },
    {
      imageUrl: "/Image3.png",
      title: "Быстрая отправка",
      desc: "По России и СНГ.",
    },
    {
      imageUrl: "/Image4.png",
      title: "Собственный цех",
      desc: "Профессиональная установка.",
    },
    {
      imageUrl: "/Image5.png",
      title: "Гарантия до 3 лет",
      desc: "На работу и товар.",
    },
    {
      imageUrl: "/Image6.png",
      title: "Сертифицированная продукция",
      desc: "Соответствие стандартам РФ.",
    },
  ];

  return (
    <section className="section-margin-bottom py-8">
      <h2 className="section-heading mb-5">Наши преимущества</h2>
      <div className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3">
        {ADVANTAGES.map(({ title, desc, imageUrl }) => (
          <div
            key={title}
            className="flex w-full flex-col items-center gap-2 rounded-2xl bg-white p-3 sm:gap-4 sm:p-4"
          >
            <img
              src={imageUrl}
              alt={title}
              className="h-12 w-16 object-contain sm:h-18 sm:w-24 md:h-24 md:w-[125px]"
            />
            <p className="font-manrope text-center text-[18px] font-bold text-[#222] lg:text-2xl">
              {title}
            </p>
            <p className="font-manrope text-center text-sm text-[18px] text-[#222] md:text-xl">
              {desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
