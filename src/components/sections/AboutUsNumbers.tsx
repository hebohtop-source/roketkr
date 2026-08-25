export default function AboutUsNumbers() {
  return (
    <div className="flex flex-col items-start gap-6 md:gap-8 w-full px-4 sm:px-6 lg:px-12 py-10 md:py-16">
      <p className="text-[#222] font-manrope text-3xl sm:text-4xl md:text-[50px] font-bold">
        О нас в цифрах
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full">
        {[
          { value: "12+", label: "лет на рынке" },
          { value: "800+", label: "товаров в наличии" },
          { value: "1000+", label: "выполненных работ" },
          { value: "До 3 лет", label: "Гарантии" },
        ].map(({ value, label }) => (
          <div key={label} className="flex p-4 md:p-6 flex-col items-center gap-3 md:gap-4 rounded-2xl bg-[#FFF] w-full">
            <p className="text-[#0661CA] font-manrope text-3xl md:text-[40px] font-bold">
              {value}
            </p>
            <p className="text-[#222] font-manrope text-lg md:text-2xl text-center">
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
