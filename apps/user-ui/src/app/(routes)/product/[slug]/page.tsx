import ProductDetails from "apps/user-ui/src/shared/components/products/product-details";
import axiosInstance from "apps/user-ui/src/utils/axiosInstance";
import { Metadata } from "next";

async function fetchProductDetails(slug: string) {
  const response = await axiosInstance.get(`/product/api/get-product-details/${slug}`);

  return response.data.product;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await fetchProductDetails(params.slug);

  return {
    openGraph: {
      title: `${product?.title} | E-shop`,
      description:
        product?.short_description ||
        "Discover high-quality products on E-shop",
      images: [product?.images?.[0]?.url || "/default-image.jpg"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product?.title,
      description: product?.short_description || "",
      images: [product?.images?.[0]?.url || "/default-image.jpg"],
    },
  };
}

const Page = async ({ params }: { params: { slug: string } }) => {
  const productDetails = await fetchProductDetails(params?.slug);
  
  return <ProductDetails productDetails={productDetails} />
};

export default Page;
