import { Menu } from "lucide-react"
import Link from "next/link"

export const BottomNavBar = (props: {}) => {
  return (
    <>

      <div className="flex py-6 px-[50px] items-center gap-6 bg-[#0661CA] w-full overflow-hidden">
        <div className="flex items-center gap-4 w-full">
          <div className="flex p-4 items-start gap-3 rounded-2xl bg-[#FFF] w-fit overflow-hidden">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 overflow-hidden relative "
            >
              <path
                d="M3 12H21M3 6H21M3 18H21"
                stroke="#0661CA"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-[#0661CA] font-manrope text-lg font-medium w-fit">
              Каталог
            </p>
          </div>
          <button className="cursor-pointer text-nowrap flex p-2 justify-center items-center gap-2.5 rounded-2xl bg-[rgba(255,255,255,0.20)] w-full">
            <p className="text-[#FFF] font-manrope text-lg w-fit">О нас</p>
          </button>
          <button className="cursor-pointer text-nowrap flex p-2 justify-center items-center gap-2.5 rounded-2xl bg-[rgba(255,255,255,0.20)] w-full">
            <p className="text-[#FFF] font-manrope text-lg w-fit">
              Установка комплектов
            </p>
          </button>
          <button className="cursor-pointer text-nowrap flex p-2 justify-center items-center gap-2.5 rounded-2xl bg-[rgba(255,255,255,0.20)] w-full">
            <p className="text-[#FFF] font-manrope text-lg w-fit">
              !!Регистрация в ГИБДД
            </p>
          </button>
          <button className="cursor-pointer text-nowrap flex p-2 flex-col justify-center items-center gap-2.5 rounded-2xl bg-[rgba(255,255,255,0.20)] w-full">
            <p className="text-[#FFF] font-manrope text-lg w-fit">
              Сертификаты
            </p>
          </button>
          <button className="cursor-pointer text-nowrap flex p-2 justify-center items-center gap-2.5 rounded-2xl bg-[rgba(255,255,255,0.20)] w-full">
            <p className="text-[#FFF] font-manrope text-lg w-fit">Акции</p>
          </button>
          <button className="cursor-pointer text-nowrap flex p-2 justify-center items-center gap-2.5 rounded-2xl bg-[rgba(255,255,255,0.20)] w-full">
            <p className="text-[#FFF] font-manrope text-lg w-fit">Отзывы</p>
          </button>
        </div>
        <div className="flex flex-col justify-between items-center w-fit h-[52px]">
          <div className="flex items-center gap-3 w-fit">
            <div className="w-6 h-6 relative">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 absolute left-0 top-0 "
              >
                <path
                  d="M0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12Z"
                  fill="#0088CC"
                />
              </svg>
              <svg
                width="12"
                height="10"
                viewBox="0 0 12 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-2.5 absolute left-[5px] top-2 "
              >
                <path
                  d="M0.824937 4.28122C4.04616 2.87779 6.19414 1.95256 7.26889 1.50553C10.3375 0.229185 10.9751 0.0074702 11.3907 7.09769e-05C11.4822 -0.00146117 11.6865 0.0211922 11.8189 0.128617C11.9307 0.219324 11.9615 0.341857 11.9762 0.427857C11.9909 0.513857 12.0092 0.709768 11.9947 0.862848C11.8284 2.61007 11.1088 6.85012 10.7428 8.80704C10.5879 9.63508 10.2829 9.91272 9.98764 9.93989C9.34596 9.99894 8.8587 9.51583 8.2372 9.10843C7.26468 8.47093 6.71527 8.07408 5.77127 7.452C4.68032 6.73308 5.38754 6.33795 6.00927 5.69219C6.17198 5.52319 8.99923 2.95159 9.05395 2.71831C9.06079 2.68913 9.06714 2.58038 9.00253 2.52295C8.93792 2.46553 8.84257 2.48516 8.77375 2.50078C8.67621 2.52292 7.1226 3.5498 4.11292 5.58142C3.67193 5.88424 3.2725 6.03178 2.91462 6.02405C2.52009 6.01553 1.76117 5.80097 1.19699 5.61758C0.504996 5.39264 -0.0449838 5.27372 0.00290711 4.8917C0.0278516 4.69272 0.301862 4.48923 0.824937 4.28122Z"
                  fill="white"
                />
              </svg>
            </div>
            <div className="rounded-[41px] w-6 h-6 overflow-hidden relative">
              <div className="w-6 h-6 absolute left-0 top-0">
                <div className="w-6 h-6 absolute left-0 top-0">
                  <img
                    src="/Rectangle.png"
                    className="w-6 h-6 absolute left-0 top-0 max-w-none"
                    alt="Rectangle"
                  />
                </div>
              </div>
              <svg
                width="19"
                height="19"
                viewBox="0 0 19 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[18px] h-[18px] absolute left-[3px] top-[3px] "
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.36874 18.2119C7.56857 18.2119 6.732 17.9491 5.27785 16.8979C4.35806 18.0805 1.44539 19.0047 1.31837 17.4235C1.31837 16.2365 1.05557 15.2335 0.757733 14.1385C0.402956 12.7895 0 11.2872 0 9.11032C0 3.91131 4.26608 0 9.32056 0C14.3794 0 18.3433 4.10402 18.3433 9.1585C18.3603 14.1348 14.345 18.1853 9.36874 18.2119ZM9.4432 4.49384C6.98166 4.36682 5.06323 6.07063 4.63838 8.7424C4.28798 10.9543 4.90994 13.648 5.43991 13.7881C5.69395 13.8494 6.33342 13.3326 6.732 12.934C7.39107 13.3893 8.15854 13.6628 8.95702 13.7268C11.5076 13.8495 13.6869 11.9077 13.8582 9.35998C13.9579 6.80683 11.9941 4.64433 9.44319 4.49822L9.4432 4.49384Z"
                  fill="white"
                />
              </svg>
            </div>
            <div className="w-6 h-6 relative">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 absolute left-0 top-0 "
              >
                <path
                  d="M0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12Z"
                  fill="#25D366"
                />
              </svg>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3 absolute left-1.5 top-1.5 "
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.2 1.725C9.075 0.6 7.575 0 6 0C2.7 0 0 2.7 0 6C0 7.05 0.300005 8.1 0.825005 9L0 12L3.15001 11.175C4.05001 11.625 5.025 11.925 6 11.925C9.3 11.925 12 9.225 12 5.925C12 4.35 11.325 2.85 10.2 1.725ZM6 10.95C5.1 10.95 4.2 10.725 3.45 10.275L3.3 10.2L1.425 10.725L1.95 8.925L1.8 8.7C1.275 7.875 1.05 6.975 1.05 6.075C1.05 3.375 3.3 1.125 6 1.125C7.35 1.125 8.55001 1.65 9.52501 2.55C10.5 3.525 10.95 4.725 10.95 6.075C10.95 8.7 8.775 10.95 6 10.95ZM8.7 7.2C8.55 7.125 7.80001 6.75 7.65001 6.75C7.50001 6.675 7.42499 6.675 7.34999 6.825C7.27499 6.975 6.97501 7.275 6.90001 7.425C6.82501 7.5 6.74999 7.5 6.59999 7.5C6.44999 7.425 6.00001 7.275 5.40001 6.75C4.95001 6.375 4.65 5.85 4.575 5.7C4.5 5.55 4.57501 5.475 4.65001 5.4C4.72501 5.325 4.8 5.25 4.875 5.175C4.95 5.1 4.95001 5.025 5.02501 4.95C5.10001 4.875 5.02501 4.8 5.02501 4.725C5.02501 4.65 4.725 3.9 4.575 3.6C4.5 3.375 4.35001 3.375 4.27501 3.375C4.20001 3.375 4.12499 3.375 3.97499 3.375C3.89999 3.375 3.74999 3.375 3.59999 3.525C3.44999 3.675 3.075 4.05 3.075 4.8C3.075 5.55 3.6 6.225 3.675 6.375C3.75 6.45 4.72499 8.025 6.22499 8.625C7.49999 9.15 7.72501 9 8.02501 9C8.32501 9 8.925 8.625 9 8.325C9.15 7.95 9.15 7.65 9.075 7.65C9 7.275 8.85 7.275 8.7 7.2Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-3 w-fit">
            <div className="w-6 h-6 relative">
              <div className="rounded-[500px] bg-[#07F] w-6 h-6 absolute left-0 top-0"></div>
              <svg
                width="14"
                height="9"
                viewBox="0 0 14 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-[13px] h-2 absolute left-[5px] top-2 "
              >
                <path
                  d="M7.18951 8.4C2.67958 8.4 0.107183 5.24685 0 0H2.25909C2.33329 3.85105 3.99875 5.48228 5.31793 5.81862V0H7.4451V3.32132C8.74778 3.17838 10.1164 1.66486 10.5781 0H12.7053C12.5313 0.863446 12.1845 1.68099 11.6866 2.4015C11.1886 3.12201 10.5502 3.72998 9.81137 4.18739C10.6361 4.60533 11.3646 5.1969 11.9487 5.92305C12.5328 6.6492 12.9593 7.49342 13.2 8.4H10.8585C10.6424 7.61257 10.2032 6.90768 9.59603 6.37369C8.98883 5.83971 8.2406 5.50036 7.4451 5.3982V8.4H7.18951V8.4Z"
                  fill="white"
                />
              </svg>
            </div>
            <div className="w-6 h-6 relative">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 absolute left-0 top-0 "
              >
                <path
                  d="M0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z"
                  fill="white"
                />
              </svg>
              <div className="w-3 h-3 absolute left-1.5 top-1.5">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3 absolute left-0 top-0 "
                >
                  <path
                    d="M7.15714 7.15714C6.21429 8.13 6.14571 9.34286 6.06429 12C8.54143 12 10.2514 11.9914 11.1343 11.1343C11.9914 10.2514 12 8.46 12 6.06429C9.34286 6.15 8.13 6.21429 7.15714 7.15714V7.15714ZM0 6.06429C0 8.46 0.00857142 10.2514 0.865714 11.1343C1.74857 11.9914 3.45857 12 5.93571 12C5.85 9.34286 5.78571 8.13 4.84286 7.15714C3.87 6.21429 2.65714 6.14571 0 6.06429V6.06429ZM5.93571 0C3.46286 0 1.74857 0.00857142 0.865714 0.865714C0.00857142 1.74857 0 3.54 0 5.93571C2.65714 5.85 3.87 5.78571 4.84286 4.84286C5.78571 3.87 5.85429 2.65714 5.93571 0V0ZM7.15714 4.84286C6.21429 3.87 6.14571 2.65714 6.06429 0C8.54143 0 10.2514 0.00857142 11.1343 0.865714C11.9914 1.74857 12 3.54 12 5.93571C9.34286 5.85 8.13 5.78571 7.15714 4.84286"
                    fill="#2C3036"
                  />
                </svg>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3 absolute left-0 top-0 "
                >
                  <path
                    d="M12 6.06429V5.93571C9.34286 5.85 8.13 5.78571 7.15714 4.84286C6.21429 3.87 6.14571 2.65714 6.06429 0H5.93571C5.85 2.65714 5.78571 3.87 4.84286 4.84286C3.87 5.78571 2.65714 5.85429 0 5.93571V6.06429C2.65714 6.15 3.87 6.21429 4.84286 7.15714C5.78571 8.13 5.85429 9.34286 5.93571 12H6.06429C6.15 9.34286 6.21429 8.13 7.15714 7.15714C8.13 6.21429 9.34286 6.14571 12 6.06429"
                    fill="white"
                  />
                </svg>
              </div>
            </div>
            <div className="w-6 h-6 relative">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 absolute left-0 top-0 "
              >
                <path
                  d="M0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12Z"
                  fill="#FF0000"
                />
              </svg>
              <svg
                width="12"
                height="9"
                viewBox="0 0 12 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-2 absolute left-1.5 top-2 "
              >
                <path
                  d="M11.7 1.275C11.55 0.750001 11.175 0.375 10.65 0.225C9.75001 1.3411e-07 5.925 0 5.925 0C5.925 0 2.175 1.3411e-07 1.2 0.225C0.675005 0.375 0.299998 0.750001 0.149998 1.275C-2.29105e-06 2.25 0 4.2 0 4.2C0 4.2 2.27988e-06 6.15 0.225002 7.125C0.375002 7.65 0.749998 8.025 1.275 8.175C2.175 8.4 6 8.4 6 8.4C6 8.4 9.74999 8.4 10.725 8.175C11.25 8.025 11.625 7.65 11.775 7.125C12 6.15 12 4.2 12 4.2C12 4.2 12 2.25 11.7 1.275ZM4.8 6V2.4L7.95 4.2L4.8 6Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>


    </>
  )
}

