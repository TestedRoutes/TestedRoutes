# Seychelles destination – web assets

Web-sized derivatives of `../../photos/`, imported directly by
`app/(site)/destinations/page.jsx` and `app/(site)/destinations/seychelles/page.jsx`
as `next/image` static imports.

This is the one path under `content/countries/` that is **committed** – see the
negation in `.gitignore`. The originals stay out of the repo: they run 3–10 MB
each and the folder includes two video files.

Regenerate by re-exporting the original below at 2560 px on the long edge, JPEG
quality 85 (same settings as the Inspire pipeline), keeping the target filename.
Filenames are kebab-case after what the photo SHOWS, not after the intake number
– the numbering in `photos/` carries no slot meaning.

| Original in `../../photos/` | Web file |
| --- | --- |
| 1. La Digue - source dargent from water.jpg | source-dargent-from-water.jpg |
| 2. Mahe Garden hill hotel .jpg | garden-hill-pool.jpg |
| 3. La Digue - source dargent sunset.jpg | source-dargent-sunset.jpg |
| 5. Praslin - Anse Georgette sunset rocks.jpg | anse-georgette-sunset.jpg |
| 6. Praslin - Raffles hotel.jpg | raffles-pool.jpg |
| 7. St. Pierre Island.jpg | st-pierre-island.jpg |
| 8. La Digue - Anse Pierrot.jpg | anse-pierrot.jpg |
| 9. Mahe - hike to Anse Major.jpg | anse-major-trail.jpg |
| 10. La Digue - crystal water kayaks.jpg | source-dargent-kayak.jpg |
| 12. Praslin - Anse Georgette sunset Paulius.jpg | anse-georgette-handstand.jpg |
| 13. Praslin - Anse Lazio rocks.jpg | anse-lazio-rocks.jpg |
| 14. Praslin - Giant Tortoise Raffles.jpg | raffles-tortoises.jpg |
| 15. Praslin - Anse Georgette day.jpg | anse-georgette-day.jpg |
| 16. La Digue - source dargent sunrise.jpg | source-dargent-sunrise.jpg |
| 17. Mahe Beau Vallon.jpg | beau-vallon.jpg |
| 18. Curieuse tortoise.jpg | curieuse-tortoises.jpg |
| 19. bat curry.png | bat-curry.jpg |
| 20. Mahe hike.jpg | mahe-hike-view.jpg |

`4. Curieuse tortoise.mp4` and `11. Curieuse boats.mp4` are not used on the
destination page.
