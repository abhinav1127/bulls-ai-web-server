export interface DisplayVersion {
  description_html: string;
  traffic_percentage: number;
  hero_image_url: string;
}

export interface DisplayVersionWithProductId extends DisplayVersion {
  product_id: string;
}

interface Image {
  image_url: string;
}

interface Version {
  description_html: string;
  traffic_percentage: number;
  images: Image;
}

export interface Product {
  external_id: string;
  versions: Version[];
}

export function mapProductsToDisplayVersion(
  products: Product[]
): Record<number, DisplayVersion> {
  const obj: Record<number, DisplayVersion> = {};

  products.forEach((product) => {
    const externalId = Number(
      product.external_id.replace("gid://shopify/Product/", "")
    );
    if (product.versions.length !== 1) {
      throw new Error(
        `Product with external_id ${externalId} does not have exactly one version.`
      );
    }
    const version = product.versions[0];
    const displayVersion: DisplayVersion = {
      hero_image_url: version.images.image_url,
      ...version,
    };
    obj[externalId] = displayVersion;
  });

  return obj;
}
