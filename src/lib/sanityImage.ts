import { sanityClient } from './sanityClient'
import { createImageUrlBuilder } from "@sanity/image-url";

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source)
}