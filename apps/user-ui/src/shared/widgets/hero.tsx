
import { MoveRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();

  return (
    <div className="bg-[#115061] h-[85vh] flex flex-col justify-center w-full">
      <div className="md:w-[80%] m-auto md:flex h-full items-center">
        <div className="md:w-1/2">
          <p className="text-white pb-2 text-xl font-Roboto font-normal">
            Starting from $50
          </p>
          <h1 className="text-white font-extrabold text-6xl font-Robot">
            The best watch <br />
            collection 2025
          </h1>
          <p className="font-Oregano text-3xl pt-4 text-white">
            Exclusive offer <span className="text-yellow-400">15%</span>off this
            week.
          </p>
          <br />
          <button
            onClick={() => router.push("/products")}
            className="w-[150px] gap-2 font-semibold h-[48px] hover:text-gray-300 border border-gray-300 flex justify-center items-center text-white"
          >
            Shop Now <MoveRight />
          </button>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <Image alt="" src={"/watch-chatgpt.png"} width={450} height={450} />
        </div>
      </div>
    </div>
  );
};

export default Hero;
