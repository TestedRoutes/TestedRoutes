export default {
  name: "galleryGrid",
  title: "Gallery grid",
  type: "object",
  description:
    "A grid of photos embedded in the story. Use for 3 or more images you want to show together; for a single image use the Image block.",
  fields: [
    {
      name: "images",
      title: "Images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              title: "Alt text",
              type: "string",
              description:
                "Describe the image for screen readers and SEO. Required.",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "caption",
              title: "Caption",
              type: "string",
              description: "Optional caption shown under the image.",
            },
          ],
        },
      ],
      validation: (Rule) => Rule.min(2),
    },
    {
      name: "layout",
      title: "Layout",
      type: "string",
      options: {
        list: [
          { title: "Grid (masonry)", value: "masonry" },
          { title: "Grid (uniform 3-up)", value: "grid3" },
          { title: "Grid (uniform 2-up)", value: "grid2" },
          { title: "Carousel (horizontal scroll)", value: "carousel" },
        ],
      },
      initialValue: "masonry",
    },
  ],
  preview: {
    select: { image0: "images.0", count: "images.length", layout: "layout" },
    prepare({ image0, count, layout }) {
      return {
        title: `Gallery (${count || 0} images, ${layout || "masonry"})`,
        media: image0,
      };
    },
  },
};
