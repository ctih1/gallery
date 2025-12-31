import sys
import os
import shutil
from PIL import Image, ExifTags, ImageFile
import json
import piexif
from typing import List, TypedDict, Tuple, Optional

PHOTO_LOCATIONS = os.path.join("static", "images")
SAVE_PATH = os.path.join("src", "lib", "images.json")

Metadata = TypedDict("Metadata", {
    "model": str,
    "make": str,
    "time": str,
    "iso": int,
    "exposure": Tuple[int, int],
    "focal-length": Tuple[int, int],
    "aperature": Tuple[int, int],
    "unedited": Optional[str],
    "description": str
})
    

def ask_unedited():
    unedited_path = input("Please enter the path to your unedited file: ")
    real_image = input("Filename for your edited image: ")
    
    with open(os.path.join(PHOTO_LOCATIONS, real_image + ".json"), "r") as f:
        existing_data = json.load(f)

    unedited_image = Image.open(unedited_path)

    moved_unedited = Image.new(unedited_image.mode, unedited_image.size)
    moved_unedited.putdata(unedited_image.getdata())
    unedited_filename = "unedited_"+real_image
    moved_unedited.save(os.path.join(PHOTO_LOCATIONS, unedited_filename))

    existing_data["unedited"] = unedited_filename

    with open(os.path.join(PHOTO_LOCATIONS, real_image + ".json"), "w") as f:
        json.dump(existing_data, f)

    print("Done!")

def split_filename_and_extension(filename: str) -> Tuple[str, str]:
    return tuple(filename.rsplit(".", maxsplit=1)) # type: ignore[assignment]

def migrate_structure():
    with open(SAVE_PATH, "r") as f:
        images: List[str] = json.load(f)
    
    for image in images:
        image_path = os.path.join(PHOTO_LOCATIONS, image)

        with open(image_path+".json", "r") as f:
            metadata: Metadata = json.load(f)

        os.rename(image_path, image_path+".tmp")
        os.mkdir(image_path)

        _, extension = split_filename_and_extension(image_path)

        os.rename(image_path+".tmp", os.path.join(image_path, f"primary.{extension}"))
        os.rename(image_path+".webp", os.path.join(image_path, f"thumbnail.webp"))
        os.rename(image_path+".json", os.path.join(image_path, f"metadata.json"))

        unedited: str | None = metadata.get("unedited")
        if unedited:
            _, extension = split_filename_and_extension(unedited)
            os.rename(os.path.join(PHOTO_LOCATIONS, unedited), os.path.join(image_path, f"unedited.{extension}"))

        print(f"Conmverted {image}")

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
    if "-merge" in sys.argv or "--merge" in sys.argv:
        metadata_path = input("Please enter the path to your file containing metadata: ")
    
    if "--add-unedited" in sys.argv and "--quit" in sys.argv:
        ask_unedited()
        quit()

    print("Opening and processing EXIF tags")
    unedited_image = Image.open(metadata_path)
    image: Image.Image = Image.open(image_path)
    exif = unedited_image.getexif()
    exif_dict = {ExifTags.TAGS[k]: str(v) for k, v in exif.items()}
    exif_data = piexif.load(metadata_path)
    exif_ifd = exif_data.get("Exif", {})

    print(f"Creating new image in {PHOTO_LOCATIONS}")
    moved_image = Image.new(image.mode, image.size) # Removes EXIF data
    moved_image.putdata(image.getdata())
    image_filename: str = str(image.filename).split(os.path.sep)[-1].lower()
    moved_image.save(os.path.join(PHOTO_LOCATIONS, image_filename))

    print(f"Creating unedited version {PHOTO_LOCATIONS}/unedited_{image_filename}")
    moved_unedited = Image.new(unedited_image.mode, unedited_image.size)
    moved_unedited.putdata(unedited_image.getdata())
    unedited_filename = "unedited_"+image_filename
    moved_unedited.save(os.path.join(PHOTO_LOCATIONS, unedited_filename))

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
            "unedited": unedited_filename,
            "description": "No description"
        }, f)

        print("Created metadata file")

    with open(os.path.join("src", "lib", "images.json"), "r") as f:
        data = json.load(f)
        data.append(image_filename)

        with open(os.path.join("src", "lib", "images.json"), "w") as f:
            json.dump(data, f)

    if "--add-unedited" in sys.argv:
        ask_unedited()

    print("Done!")

