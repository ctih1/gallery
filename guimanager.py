import customtkinter
from add_image import Metadata, SAVE_PATH, split_filename_and_extension, remove_metadata
from typing import List, Tuple
import os
import json
import threading
from PIL import Image, ImageTk
import subprocess

def get_image_paths() -> List[str]:
    paths: List[str] = []
    with open(SAVE_PATH, "r") as f:
        for path in json.load(f):
            filename, extension = split_filename_and_extension(path)
            paths.append(os.path.join(os.getcwd(), "static", "images", path, f"primary.{extension}"))

    return paths

def load_image(path: str, result_array: List[Tuple[Image.Image, str] | None], result_index: int) -> None:
    image = Image.open(path)
    result_array[result_index] = image, path

loader_threads: List[threading.Thread] = []
cols = 5

class App(customtkinter.CTk):
    def __init__(self):
        super().__init__()
        self.geometry("650x500")
        self.title("Gallery GUI Manager")

        self.photo_container = customtkinter.CTkScrollableFrame(self, 600, 500)
        self.photo_container.pack()

        paths = get_image_paths()
        images: List[Tuple[Image.Image, str] | None] = [None for _ in paths]

        for i, image in enumerate(paths):
            thread = threading.Thread(target=load_image, args=(image, images, i))
            thread.start()
            loader_threads.append(thread)

        for thread in loader_threads:
            thread.join()

        row = 0
        for i, image in enumerate(images, start=1):
            if image is None:
                raise ValueError("Image is None even after thread?")
            
            image_button = customtkinter.CTkButton(
                self.photo_container,
                text="", 
                image=customtkinter.CTkImage(image[0], size=(100, 100)), 
                width=100, height=100, 
                fg_color="transparent",
                border_width=0,
                bg_color="transparent",
                border_spacing=0,
                command=lambda img=image[1]: self.summon_window(img) # type: ignore[assignment]
            )
            image_button.grid(row=row, column=i-(row*cols)-1, padx=2, pady=2)

            if i != 0 and i % cols == 0:
                row += 1

    def summon_window(self, filename: str):
        print(filename)
        a = ImageEditing(filename)
        a.mainloop()
        a.destroy()

class ImageEditing(customtkinter.CTkToplevel):
    def __init__(self, image_path: str):
        super().__init__()

        self.base_path: str = os.sep.join(image_path.rsplit(os.sep, 1)[:-1])
        self.metadata_path: str = os.path.join(self.base_path, "metadata.json")

        self.filename, self.extension = split_filename_and_extension(image_path.rsplit(os.sep, 1)[-1])
        self.title("Image editing")

        with open(self.metadata_path, "r") as f:
            self.metadata: Metadata = json.load(f)

        image = Image.open(image_path)

        ratio = image.width / image.height
        w, h = round(500*ratio), 500
        self.image = customtkinter.CTkImage(image, size=(w,h))
        self.image_button = customtkinter.CTkButton(self, text="", image=self.image, width=w, height=h, fg_color="transparent", border_width=0)
        self.image_button.place(x=0, y=0)

        self.geometry(f"{w+400}x500")

        self.info_frame = customtkinter.CTkFrame(self, width=400, height=h)
        self.info_frame.place(relx=1, anchor="ne")
        self.info_frame.pack_propagate(False)
        

        self.image_title = customtkinter.CTkLabel(
            self.info_frame,
            text=f"{self.metadata['make']} {self.metadata['model']}\n({self.base_path.rsplit(os.sep, 1)[-1]})", font=customtkinter.CTkFont(size=24, weight="bold"),
            anchor="w",
            justify="left"
        )
        self.image_title.pack()

        self.image_description = customtkinter.CTkTextbox(self.info_frame, width=400)
        self.image_description.insert("0.0", self.metadata["description"])
        self.image_description.pack()

        aperature = self.metadata["aperature"]
        exposure = self.metadata["exposure"]
        focal_length = self.metadata["focal-length"]
        time_taken = self.metadata["time"]
        iso = self.metadata["iso"]

        self.other_info = customtkinter.CTkLabel(self.info_frame, text=f"f/{aperature[0]/aperature[1]}\n{exposure[0]/exposure[1]}s\n{focal_length[0]/focal_length[1]}mm\nISO: {iso}\n{time_taken}")
        self.other_info.pack()


        self.unedited_version = customtkinter.CTkButton(self.info_frame, text="Raw: " + str(self.metadata.get("unedited", "not specified")))
        self.unedited_version.bind("<Button-1>", command=lambda _: self.set_unedited())
        self.unedited_version.bind("<Button-3>", command=lambda _: self.set_unedited_self())
        self.unedited_version.pack()

        self.open_button = customtkinter.CTkButton(self.info_frame, text="Open metadata in VSCode", command=self.open_code)
        self.open_button.pack()

        self.save_button = customtkinter.CTkButton(self.info_frame, text="Save changes", command=self.save_metadata)
        self.save_button.pack()

    def open_code(self):
        os.system(f"code {self.metadata_path}")

    def set_unedited(self):
        file = customtkinter.filedialog.askopenfilename()

        if file:
            image = remove_metadata(Image.open(file))

            _, extension = split_filename_and_extension(file.rsplit(os.sep, 1)[-1])

            filename =  f"unedited.{extension}"
            image.save(os.path.join(self.base_path, filename))
            self.metadata["unedited"] = filename

    def set_unedited_self(self):
        print("set as unedited")
        self.metadata["unedited"] = "self"
        self.unedited_version.configure(fg_color="red", text="Raw: self")

    def save_metadata(self):
        self.metadata["description"] = self.image_description.get("0.0", "end").strip()
        
        with open(self.metadata_path, "w") as f:
            json.dump(self.metadata, f)

        self.save_button.configure(text="Saved!")

app = App()
app.mainloop()