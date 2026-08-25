import Link from "next/link"

const SOCIALS = [
  { label: "Telegram", href: "https://t.me/roketkrd123" },
  { label: "Max", href: "/#" },
  { label: "WhatsApp", href: "https://wa.me/79889197112" },
  { label: "VK", href: "https://vk.ru/roketkrd123" },
  { label: "Zen", href: "/sz" },
  { label: "YouTube", href: "https://youtube.com/@roketkrd?si=z_J1nMlKDh9JIref" },
]

export const ContactSection = () => {
  return (
    <section className="flex flex-col lg:flex-row gap-6 items-stretch section-margin-bottom">
      <div className="flex p-6 sm:p-10 flex-col items-start gap-8 rounded-2xl bg-[#FFF] w-full overflow-hidden">
        <p className="section-heading w-fit">
          Контакты
        </p>
        <div className="flex flex-col justify-center items-start gap-6 w-full">
          <Link href="tel:+7999633-08-80" className="flex items-center gap-4 w-fit cursor-pointer hover:opacity-80 transition-opacity">
            {/* phone svg unchanged */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 overflow-hidden relative">
              <path d="M18.7329 7.99984C20.0352 8.25392 21.2321 8.89085 22.1703 9.82908C23.1085 10.7673 23.7455 11.9642 23.9996 13.2665M18.7329 2.6665C21.4386 2.96709 23.9617 4.17874 25.8879 6.10251C27.8141 8.02629 29.0289 10.5478 29.3329 13.2532M13.6355 18.4839C12.0334 16.8818 10.7684 15.0703 9.84037 13.1375C9.76055 12.9712 9.72064 12.8881 9.68998 12.7829C9.58101 12.4091 9.65928 11.9501 9.88596 11.6335C9.94975 11.5444 10.026 11.4682 10.1784 11.3158C10.6445 10.8497 10.8776 10.6166 11.03 10.3822C11.6046 9.49837 11.6046 8.35893 11.03 7.47508C10.8776 7.24071 10.6445 7.00764 10.1784 6.5415L9.91855 6.28167C9.20996 5.57308 8.85566 5.21879 8.47516 5.02633C7.71841 4.64357 6.82472 4.64357 6.06797 5.02633C5.68747 5.21879 5.33317 5.57308 4.62458 6.28167L4.4144 6.49185C3.70824 7.19801 3.35516 7.5511 3.08549 8.03114C2.78626 8.56381 2.57111 9.39114 2.57293 10.0021C2.57457 10.5527 2.68138 10.929 2.89499 11.6816C4.04295 15.7261 6.20891 19.5426 9.39289 22.7266C12.5769 25.9105 16.3933 28.0765 20.4379 29.2245C21.1905 29.4381 21.5668 29.5449 22.1174 29.5465C22.7283 29.5483 23.5556 29.3332 24.0883 29.034C24.5684 28.7643 24.9214 28.4112 25.6276 27.7051L25.8378 27.4949C26.5464 26.7863 26.9007 26.432 27.0931 26.0515C27.4759 25.2947 27.4759 24.401 27.0931 23.6443C26.9007 23.2638 26.5464 22.9095 25.8378 22.2009L25.578 21.9411C25.1118 21.4749 24.8787 21.2419 24.6444 21.0895C23.7605 20.5148 22.6211 20.5148 21.7372 21.0895C21.5029 21.2419 21.2698 21.4749 20.8036 21.9411C20.6512 22.0935 20.575 22.1697 20.4859 22.2335C20.1694 22.4602 19.7104 22.5384 19.3365 22.4295C19.2314 22.3988 19.1482 22.3589 18.982 22.2791C17.0492 21.3511 15.2376 20.086 13.6355 18.4839Z" stroke="#0661CA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-[#666] font-manrope text-xl leading-[26px] w-fit">
              +7 &#40;999&#41; 633-08-80
            </p>
          </Link>
          <Link href="https://yandex.ru/maps/?from=mapframe&ll=39.009162%2C45.038375&pt=39.009162%2C45.038375&source=mapframe&utm_source=mapframe&z=16" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 w-full cursor-pointer hover:opacity-80 transition-opacity">
            {/* location svg unchanged */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 overflow-hidden relative">
              <path d="M6.66667 13.2305C6.66667 19.6996 12.326 25.0492 14.8309 27.1003C15.1894 27.3938 15.3708 27.5423 15.6383 27.6176C15.8465 27.6763 16.1531 27.6763 16.3613 27.6176C16.6293 27.5422 16.8094 27.3951 17.1693 27.1005C19.6742 25.0494 25.3332 19.7002 25.3332 13.2311C25.3332 10.7829 24.35 8.43473 22.5996 6.70363C20.8493 4.97252 18.4755 4 16.0001 4C13.5248 4 11.1507 4.97267 9.40034 6.70378C7.65 8.43488 6.66667 10.7823 6.66667 13.2305Z" stroke="#0661CA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13.3333 12C13.3333 13.4728 14.5272 14.6667 16 14.6667C17.4728 14.6667 18.6667 13.4728 18.6667 12C18.6667 10.5272 17.4728 9.33333 16 9.33333C14.5272 9.33333 13.3333 10.5272 13.3333 12Z" stroke="#0661CA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-[#666] font-manrope text-xl leading-[26px] w-fit">
              г. Краснодар, ул. Передовая, 59
            </p>
          </Link>
        </div>
        <div className="flex items-start gap-4 w-fit">
          {/* Telegram */}
          <Link href={SOCIALS[0].href} target="_blank" rel="noopener noreferrer" className="w-8 h-8 relative cursor-pointer hover:opacity-80 transition-opacity">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 absolute left-0 top-0">
              <path d="M0 16C0 24.8366 7.16344 32 16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16Z" fill="#0088CC" />
            </svg>
            <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-[13px] absolute left-[7px] top-2.5">
              <path d="M1.09992 5.70829C5.39487 3.83705 8.25885 2.60341 9.69185 2.00738C13.7833 0.30558 14.6335 0.00996026 15.1877 9.46359e-05C15.3095 -0.00194823 15.582 0.0282562 15.7586 0.171489C15.9076 0.292432 15.9486 0.455809 15.9683 0.570476C15.9879 0.685143 16.0123 0.946358 15.9929 1.15046C15.7712 3.48009 14.8118 9.13349 14.3237 11.7427C14.1172 12.8468 13.7105 13.217 13.3168 13.2532C12.4613 13.3319 11.8116 12.6878 10.9829 12.1446C9.68624 11.2946 8.95369 10.7654 7.69503 9.936C6.24042 8.97744 7.18338 8.4506 8.01236 7.58959C8.22931 7.36426 11.999 3.93546 12.0719 3.62441C12.0811 3.58551 12.0895 3.44051 12.0034 3.36394C11.9172 3.28737 11.7901 3.31355 11.6983 3.33438C11.5683 3.36389 9.4968 4.73307 5.48389 7.4419C4.89591 7.84565 4.36333 8.04237 3.88616 8.03207C3.36012 8.0207 2.34822 7.73463 1.59598 7.49011C0.673328 7.19019 -0.0599784 7.03162 0.00387615 6.52227C0.0371355 6.25697 0.402482 5.98564 1.09992 5.70829Z" fill="white" />
            </svg>
          </Link>

          {/* Max */}
          <Link href={SOCIALS[1].href} target="_blank" rel="noopener noreferrer" className="rounded-[41px] w-8 h-8 overflow-hidden relative cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 absolute left-0 top-0">
              <img src="/Rectangle(1).png" className="w-8 h-8 absolute left-0 top-0 max-w-none" alt="Rectangle" />
            </div>
            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 absolute left-1 top-1">
              <path fillRule="evenodd" clipRule="evenodd" d="M12.4916 24.2825C10.0914 24.2825 8.976 23.9321 7.03714 22.5305C5.81075 24.1073 1.92718 25.3395 1.75782 23.2313C1.75782 21.6487 1.40743 20.3113 1.01031 18.8514C0.537275 17.0527 0 15.0495 0 12.1471C0 5.21507 5.68811 0 12.4274 0C19.1726 0 24.4577 5.47203 24.4577 12.2113C24.4803 18.8464 19.1267 24.2471 12.4916 24.2825ZM12.5909 5.99179C9.30888 5.82243 6.75098 8.09417 6.1845 11.6565C5.71731 14.6057 6.54658 18.1973 7.25322 18.3842C7.59193 18.4659 8.44456 17.7768 8.976 17.2454C9.85476 17.8524 10.8781 18.217 11.9427 18.3024C15.3434 18.466 18.2492 15.877 18.4776 12.48C18.6105 9.07577 15.9921 6.19244 12.5909 5.99763L12.5909 5.99179Z" fill="white" />
            </svg>
          </Link>

          {/* WhatsApp */}
          <Link href={SOCIALS[2].href} target="_blank" rel="noopener noreferrer" className="w-8 h-8 relative cursor-pointer hover:opacity-80 transition-opacity">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 absolute left-0 top-0">
              <path d="M0 16C0 24.8366 7.16344 32 16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16Z" fill="#25D366" />
            </svg>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 absolute left-2 top-2">
              <path fillRule="evenodd" clipRule="evenodd" d="M13.6 2.3C12.1 0.8 10.1 0 8 0C3.6 0 0 3.6 0 8C0 9.4 0.400006 10.8 1.10001 12L0 16L4.20001 14.9C5.40001 15.5 6.7 15.9 8 15.9C12.4 15.9 16 12.3 16 7.9C16 5.8 15.1 3.8 13.6 2.3ZM8 14.6C6.8 14.6 5.60001 14.3 4.60001 13.7L4.39999 13.6L1.89999 14.3L2.60001 11.9L2.39999 11.6C1.69999 10.5 1.39999 9.3 1.39999 8.1C1.39999 4.5 4.4 1.5 8 1.5C9.8 1.5 11.4 2.2 12.7 3.4C14 4.7 14.6 6.3 14.6 8.1C14.6 11.6 11.7 14.6 8 14.6ZM11.6 9.6C11.4 9.5 10.4 9 10.2 9C10 8.9 9.89999 8.9 9.79999 9.1C9.69999 9.3 9.30001 9.7 9.20001 9.9C9.10001 10 8.99999 10 8.79999 10C8.59999 9.9 8.00001 9.7 7.20001 9C6.60001 8.5 6.20001 7.8 6.10001 7.6C6.00001 7.4 6.10001 7.3 6.20001 7.2C6.30001 7.1 6.4 7 6.5 6.9C6.6 6.8 6.60001 6.7 6.70001 6.6C6.80001 6.5 6.70001 6.4 6.70001 6.3C6.70001 6.2 6.30001 5.2 6.10001 4.8C6.00001 4.5 5.80001 4.5 5.70001 4.5C5.60001 4.5 5.49999 4.5 5.29999 4.5C5.19999 4.5 4.99999 4.5 4.79999 4.7C4.59999 4.9 4.10001 5.4 4.10001 6.4C4.10001 7.4 4.79999 8.3 4.89999 8.5C4.99999 8.6 6.29999 10.7 8.29999 11.5C9.99999 12.2 10.3 12 10.7 12C11.1 12 11.9 11.5 12 11.1C12.2 10.6 12.2 10.2 12.1 10.2C12 9.7 11.8 9.7 11.6 9.6Z" fill="white" />
            </svg>
          </Link>

          {/* VK */}
          <Link href={SOCIALS[3].href} target="_blank" rel="noopener noreferrer" className="w-8 h-8 relative cursor-pointer hover:opacity-80 transition-opacity">
            <div className="rounded-[500px] bg-[#07F] w-8 h-8 absolute left-0 top-0"></div>
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[11px] absolute left-[7px] top-2.5">
              <path d="M9.58601 11.2C3.57277 11.2 0.142911 6.9958 0 0H3.01212C3.11106 5.13473 5.33167 7.30971 7.09057 7.75816V0H9.9268V4.42843C11.6637 4.23784 13.4886 2.21982 14.1042 0H16.9404C16.7084 1.15126 16.246 2.24132 15.5821 3.202C14.9181 4.16268 14.067 4.97331 13.0818 5.58318C14.1815 6.14044 15.1528 6.9292 15.9316 7.8974C16.7104 8.86559 17.2791 9.99122 17.6 11.2H14.478C14.1899 10.1501 13.6043 9.21025 12.7947 8.49826C11.9851 7.78627 10.9875 7.33382 9.9268 7.1976V11.2H9.58601V11.2Z" fill="white" />
            </svg>
          </Link>

          {/* Zen */}
          <Link href={SOCIALS[4].href} target="_blank" rel="noopener noreferrer" className="w-8 h-8 relative cursor-pointer hover:opacity-80 transition-opacity">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 absolute left-0 top-0">
              <path d="M0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16Z" fill="white" />
            </svg>
            <div className="w-4 h-4 absolute left-2 top-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 absolute left-0 top-0">
                <path d="M9.54286 9.54286C8.28572 10.84 8.19429 12.4571 8.08571 16C11.3886 16 13.6686 15.9886 14.8457 14.8457C15.9886 13.6686 16 11.28 16 8.08571C12.4571 8.2 10.84 8.28572 9.54286 9.54286ZM0 8.08571C0 11.28 0.0114286 13.6686 1.15429 14.8457C2.33143 15.9886 4.61143 16 7.91429 16C7.8 12.4571 7.71429 10.84 6.45714 9.54286C5.16 8.28572 3.54286 8.19429 0 8.08571ZM7.91429 0C4.61714 0 2.33143 0.0114286 1.15429 1.15429C0.0114286 2.33143 0 4.72 0 7.91429C3.54286 7.8 5.16 7.71429 6.45714 6.45714C7.71429 5.16 7.80572 3.54286 7.91429 0ZM9.54286 6.45714C8.28572 5.16 8.19429 3.54286 8.08571 0C11.3886 0 13.6686 0.0114286 14.8457 1.15429C15.9886 2.33143 16 4.72 16 7.91429C12.4571 7.8 10.84 7.71429 9.54286 6.45714Z" fill="#2C3036" />
                <path d="M16 8.08571V7.91429C12.4571 7.8 10.84 7.71429 9.54286 6.45714C8.28572 5.16 8.19429 3.54286 8.08571 0H7.91429C7.8 3.54286 7.71429 5.16 6.45714 6.45714C5.16 7.71429 3.54286 7.80572 0 7.91429V8.08571C3.54286 8.2 5.16 8.28572 6.45714 9.54286C7.71429 10.84 7.80572 12.4571 7.91429 16H8.08571C8.2 12.4571 8.28572 10.84 9.54286 9.54286C10.84 8.28572 12.4571 8.19429 16 8.08571Z" fill="white" />
              </svg>
            </div>
          </Link>

          {/* YouTube */}
          <Link href={SOCIALS[5].href} target="_blank" rel="noopener noreferrer" className="w-8 h-8 relative cursor-pointer hover:opacity-80 transition-opacity">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 absolute left-0 top-0">
              <path d="M0 16C0 24.8366 7.16344 32 16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16Z" fill="#FF0000" />
            </svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-[11px] absolute left-2 top-2.5">
              <path d="M15.6 1.7C15.4 1 14.9 0.5 14.2 0.3C13 1.78814e-07 7.89999 0 7.89999 0C7.89999 0 2.90001 1.78814e-07 1.60001 0.3C0.900006 0.5 0.399997 1 0.199997 1.7C-3.05474e-06 3 0 5.6 0 5.6C0 5.6 3.03984e-06 8.2 0.300003 9.5C0.500003 10.2 0.999997 10.7 1.7 10.9C2.9 11.2 8 11.2 8 11.2C8 11.2 13 11.2 14.3 10.9C15 10.7 15.5 10.2 15.7 9.5C16 8.2 16 5.6 16 5.6C16 5.6 16 3 15.6 1.7ZM6.39999 8V3.2L10.6 5.6L6.39999 8Z" fill="white" />
            </svg>
          </Link>
        </div>
      </div>
      <iframe
        src="https://yandex.ru/map-widget/v1/?pt=39.009162,45.038375~pm2rdm&z=16&l=map"
        className="rounded-2xl w-full h-[300px] lg:h-auto lg:min-h-[400px]"
        allowFullScreen
        loading="lazy"
      />
    </section>
  )
}
