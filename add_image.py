import sys
import os
import shutil
from PIL import Image, ExifTags
import json
import piexif


PHOTO_LOCATIONS = os.path.join("static", "images")
PHOTO_SITE_LOCATION = os.path.join("src", "routes", "photos")
IMAGE_SVELTE_FILE_TEMPPLATE = """
<script lang="ts">
    import GalleryImage from "$lib/components/GalleryImage.svelte";
</script>

<GalleryImage path="{path}" metadataPath="{metadataPath}" />
"""

if __name__ == "__main__":
    image_path: str | None = None
    try:
        if not sys.argv[1].startswith("-"):
            image_path = sys.argv[1]
        else:
            raise IndexError("")
    except IndexError:
        image_path = input("Please enter the path to your file: ")

    metadata_path = image_path
    if "-merge" in sys.argv:
        metadata_path = input("Please enter the path to your file containing metadata: ")
        

    print("Opening and processing EXIF tags")
    exif_image = Image.open(metadata_path)
    image: Image.Image = Image.open(image_path)
    exif = exif_image.getexif()
    exif_dict = {ExifTags.TAGS[k]: str(v) for k, v in exif.items()}
    exif_data = piexif.load(metadata_path)
    exif_ifd = exif_data.get("Exif", {})

    print(f"Creating new image in {PHOTO_LOCATIONS}")
    moved_image = Image.new(image.mode, image.size) # Removes EXIF data
    moved_image.putdata(image.getdata())
    image_filename: str = str(image.filename).split(os.path.sep)[-1].lower()
    moved_image.save(os.path.join(PHOTO_LOCATIONS, image_filename))

    print("Creating a thumbnail")
    moved_image.convert("RGB")
    aspect_ratio = moved_image.width / moved_image.height
    height = 386
    width = height*aspect_ratio
    moved_image.thumbnail((width, height), Image.Resampling.LANCZOS)
    moved_image.save(os.path.join(PHOTO_LOCATIONS, image_filename+".webp"), "webp")

    print("Saved new image. Creating metadata json file")
    with open(os.path.join(PHOTO_LOCATIONS, image_filename)+".json", "w") as f:
        json.dump({
            "model": exif_dict.get("Model", "Unknown").rstrip(),
            "make": exif_dict.get("Make", "Unknown").rstrip(),
            "time": exif_dict.get("DateTime", "Unknown time"),
            "iso": exif_ifd.get(piexif.ExifIFD.ISOSpeedRatings),
            "expousure": exif_ifd.get(piexif.ExifIFD.ExposureTime),
            "focal-length": exif_ifd.get(piexif.ExifIFD.FocalLength),
            "aperature": exif_ifd.get(piexif.ExifIFD.FNumber),
            "description": "No description"
        }, f)

        print("Created metadata file")

    photo_site_dir = os.path.join(PHOTO_SITE_LOCATION, image_filename).lower()
    os.makedirs(photo_site_dir)
    with open(os.path.join(photo_site_dir, "+page.svelte"), "w") as f:
        f.write(IMAGE_SVELTE_FILE_TEMPPLATE.replace("{path}", f"/images/{image_filename}").replace("{metadataPath}", f"/images/{image_filename}.json"))

    print("Done!")

