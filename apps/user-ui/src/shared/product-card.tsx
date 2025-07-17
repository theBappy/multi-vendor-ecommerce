

import Image from "next/image";
import Link from "next/link";

const ProductCard = ({
  product,
  isEven,
}: {
  product: any;
  isEven?: boolean;
}) => {
  return (
    <div className="w-full min-h-[350px] h-max bg-white rounded-lg relative">
      {isEven && (
        <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] px-2 shadow-md py-1 rounded-sm font-semibold">
          OFFER
        </div>
      )}
      {product?.stock <= 5 && (
        <div className="absolute top-2 right-2 bg-yellow-400 text-slate-700 text-[10px] px-2 shadow-md py-1 rounded-sm font-semibold">
          Limited Stock
        </div>
      )}
      <Link href={`/product/${product?.slug}`}>
        <Image src={product?.images[0]?.url || "https://unsplash.com/photos/black-smart-watch-with-white-background-O43D6CYzxqM"} alt={product?.title} 
        width={300}
        height={300}
        className="w-full h-[200px] object-cover mx-auto rounded-t-md"
        />
      </Link>
    </div>
  );
};

export default ProductCard;
