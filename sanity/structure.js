export const structure = (S) =>
  S.list()
    .title("Pikelis Travel")
    .items([
      S.listItem()
        .title("Stories")
        .schemaType("story")
        .child(
          S.documentTypeList("story")
            .title("All stories")
            .defaultOrdering([{ field: "publishedDate", direction: "desc" }]),
        ),
      S.divider(),
      S.listItem()
        .title("Guides only")
        .schemaType("story")
        .child(
          S.documentList()
            .title("Stories with a guide attached")
            .filter("_type == 'story' && guide.hasGuide == true")
            .defaultOrdering([{ field: "publishedDate", direction: "desc" }]),
        ),
      S.listItem()
        .title("Drafts")
        .schemaType("story")
        .child(
          S.documentList()
            .title("Draft stories")
            .filter("_type == 'story' && status == 'draft'"),
        ),
      S.listItem()
        .title("Needs attention")
        .schemaType("story")
        .child(
          S.documentList()
            .title("Stories flagged for review")
            .filter("_type == 'story' && needsAttention == true"),
        ),
      S.divider(),
      S.listItem()
        .title("Destinations")
        .schemaType("destination")
        .child(S.documentTypeList("destination").title("Destinations")),
      S.listItem()
        .title("Collections")
        .schemaType("collection")
        .child(S.documentTypeList("collection").title("Collections")),
      S.listItem()
        .title("Categories")
        .schemaType("category")
        .child(S.documentTypeList("category").title("Categories")),
      S.divider(),
      S.listItem()
        .title("Authors")
        .schemaType("author")
        .child(S.documentTypeList("author").title("Authors")),
    ]);
