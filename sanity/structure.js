// The feedback inbox (Tracker #59). One view per triage state rather than
// one list with a status column, because triage is the workflow: open Inbox,
// read, set the status, and the doc leaves the view on its own. Docs are
// created by /api/feedback only — initialValueTemplates([]) removes the
// Studio's "create new" button so nobody can hand-author one. Triage status
// is internal-only, and story status NEVER auto-flips off feedback
// (founder decision 2026-05-02).
const feedbackList = (S, title, status) =>
  S.documentList()
    .title(title)
    .filter(
      status
        ? `_type == "feedback" && status == "${status}"`
        : `_type == "feedback"`,
    )
    .defaultOrdering([{ field: "createdAt", direction: "desc" }])
    .initialValueTemplates([]);

export const structure = (S) =>
  S.list()
    .title("TestedRoutes")
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
        .title("Feedback")
        .schemaType("feedback")
        .child(
          S.list()
            .title("Feedback")
            .items([
              S.listItem()
                .title("Inbox (new)")
                .child(feedbackList(S, "New feedback", "new")),
              S.listItem()
                .title("Acknowledged")
                .child(feedbackList(S, "Acknowledged", "acknowledged")),
              S.listItem()
                .title("Actioned")
                .child(feedbackList(S, "Actioned", "actioned")),
              S.listItem()
                .title("Dismissed")
                .child(feedbackList(S, "Dismissed", "dismissed")),
              S.divider(),
              S.listItem()
                .title("All feedback")
                .child(feedbackList(S, "All feedback", null)),
            ]),
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
        .title("Affiliate links")
        .schemaType("affiliateLink")
        .child(
          S.list()
            .title("Affiliate links")
            .items([
              S.listItem()
                .title("Global (shared)")
                .child(
                  S.documentList()
                    .title("Global affiliate links")
                    .filter('_type == "affiliateLink" && scope == "global"')
                    .defaultOrdering([{ field: "slug.current", direction: "asc" }]),
                ),
              S.listItem()
                .title("Guide-specific")
                .child(
                  S.documentList()
                    .title("Guide-specific affiliate links")
                    .filter('_type == "affiliateLink" && scope == "guide"')
                    .defaultOrdering([{ field: "slug.current", direction: "asc" }]),
                ),
              S.listItem()
                .title("All by category")
                .child(
                  S.documentList()
                    .title("All affiliate links")
                    .filter('_type == "affiliateLink"')
                    .defaultOrdering([{ field: "category", direction: "asc" }]),
                ),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title("Authors")
        .schemaType("author")
        .child(S.documentTypeList("author").title("Authors")),
      S.divider(),
      // Machine-written by the nightly rollup. Listed so the numbers are
      // inspectable when the dashboard says something surprising, not so
      // anyone edits them.
      S.listItem()
        .title("Analytics snapshots")
        .schemaType("analyticsSnapshot")
        .child(
          S.documentTypeList("analyticsSnapshot")
            .title("Daily snapshots")
            .defaultOrdering([{ field: "date", direction: "desc" }]),
        ),
    ]);
