import sys
import os
from PIL import Image, ExifTags, ImageFile
import json
import piexif
from typing import List, TypedDict, Tuple, Optional, Literal

PHOTO_LOCATIONS = os.path.join("static", "images")
SAVE_PATH = os.path.join("src", "lib", "images.json")
UNEDITED_TYPE = Literal["self"] | str | Literal[False] # self means that the image itself is unedited, exists means that an unedited version exists

Metadata = TypedDict("Metadata", {
    "model": str,
    "make": str,
    "time": str,
    "iso": int,
    "exposure": Tuple[int, int],
    "focal-length": Tuple[int, int],
    "aperature": Tuple[int, int],
    "unedited": Optional[UNEDITED_TYPE],
    "description": str
})
    

def ask_unedited(real_image_filename: str | None):
    unedited_path: str = input("Please enter the path to your unedited file: ")

    if not real_image_filename:
        real_image_filename = input("Filename for your edited image: ")

    base_path = os.path.join(PHOTO_LOCATIONS, real_image_filename)
    metadata_path = os.path.join(base_path, "metadata.json")
    with open(metadata_path, "r") as f:
        existing_data: Metadata = json.load(f)

    unedited_image = Image.open(unedited_path)
    unedited_filename = str(unedited_image.filename).rsplit(os.path.sep, 1)[-1]

    filename, extension = split_filename_and_extension(unedited_filename)

    unedited_cleaned_image = remove_metadata(unedited_image)
    unedited_cleaned_image.save(os.path.join(base_path, f"unedited.{extension}"))

    existing_data["unedited"] = f"unedited.{extension}"

    with open(metadata_path, "w") as f:
        json.dump(existing_data, f)

    print("Saved unedited version!")

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

        unedited: str | None = metadata.get("unedited") # type: ignore[assignment]
        if unedited is not None:
            _, extension = split_filename_and_extension(unedited)
            os.rename(os.path.join(PHOTO_LOCATIONS, unedited), os.path.join(image_path, f"unedited.{extension}"))

        print(f"Conmverted {image}")

def migrate_exposure():
    with open(SAVE_PATH, "r") as f:
        images: List[str] = jsonx.load(f)
    
    for image in images:
        image_path = os.path.join(PHOTO_LOCATIONS, image)
        metadata_path = os.path.join(image_path, "metadata.json")

        with open(metadata_path, "r") as f:
            metadata = json.load(f)

        if metadata.get("expousure"):
            metadata["exposure"] = metadata["expousure"]
            del metadata["expousure"]

        with open(metadata_path, "w") as f:
            json.dump(metadata, f)

def remove_metadata(image: ImageFile.ImageFile) -> Image.Image:
    new_image = Image.new(image.mode, image.size) # Removes EXIF data
    new_image.putdata(image.getdata())

    return new_image

if __name__ == "__main__":
    image_path: str | None = None
    try:
        if not sys.argv[1].startswith("-"):
            image_path = sys.argv[1]
        else:
            raise IndexError("")
    except IndexError:
        image_path = input("Please enter the path to your file: ")

    metadata_path: str = image_path

    if "--merge" in sys.argv:
        metadata_path = input("Please enter the path to your file containing metadata: ")
    
    if "--add-unedited" in sys.argv and "--quit" in sys.argv:
        ask_unedited(None)
        quit()

    print("Opening images")
    metadata_file = Image.open(metadata_path)
    image: Image.Image = Image.open(image_path)
    image_filename = str(image.filename).rsplit(os.path.sep, 1)[-1]

    filename, extension = split_filename_and_extension(image_filename)
    image_base_path: str = os.path.join(PHOTO_LOCATIONS, image_filename)


    print("Procesing EXIF tags")
    exif = metadata_file.getexif()
    exif_dict = {ExifTags.TAGS[k]: str(v) for k, v in exif.items()}
    exif_data = piexif.load(metadata_path)
    exif_ifd = exif_data.get("Exif", {})

    print(f"Removing metadata")
    metadataless_image = remove_metadata(image)
    
    print("Creating new folder for image")
    os.mkdir(image_base_path)

    print("Copying image to folder")
    metadataless_image.save(os.path.join(image_base_path, f"primary.{extension}"))


    print("Creating thumbnail for image")
    metadataless_image.convert("RGB")
    aspect_ratio: float = metadataless_image.width / metadataless_image.height

    height = 386
    width = height*aspect_ratio

    metadataless_image.thumbnail((width, height), Image.Resampling.LANCZOS)
    metadataless_image.save(os.path.join(image_base_path, "thumbnail.webp"), "webp")

    edited = ""

    if not "--add-unedited" in sys.argv:
        edited = input("Specify that the image has not been edited? Press enter to indicate it has not. ")

    print("Creating metadata json file")
    with open(os.path.join(image_base_path, "metadata.json"), "w") as f:
        metadata: Metadata = Metadata(**{
            "model": exif_dict.get("Model", "Unknown").rstrip(),
            "make": exif_dict.get("Make", "Unknown").rstrip(),
            "time": exif_dict.get("DateTime", "Unknown time"),
            "iso": exif_ifd.get(piexif.ExifIFD.ISOSpeedRatings),
            "exposure": exif_ifd.get(piexif.ExifIFD.ExposureTime),
            "focal-length": exif_ifd.get(piexif.ExifIFD.FocalLength),
            "aperature": exif_ifd.get(piexif.ExifIFD.FNumber),
            "description": "No description",
            "unedited": "self" if len("edited") == 0 else False
        })

        json.dump(metadata, f)

        print("Created metadata file")

    with open(os.path.join("src", "lib", "images.json"), "r") as f:
        data = json.load(f)
        data.append(image_filename)

        with open(os.path.join("src", "lib", "images.json"), "w") as f:
            json.dump(data, f)

    if "--add-unedited" in sys.argv:
        ask_unedited(image_filename)

    print("Done!")

