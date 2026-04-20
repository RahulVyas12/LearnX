from PIL import Image
import sys

def remove_background(input_path, output_path, tolerance=30):
    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()
        
        # Sample top-left corner as the bg color
        bg_color = datas[0]
        r_bg, g_bg, b_bg, a_bg = bg_color
        
        new_data = []
        for item in datas:
            # Check if pixel is within tolerance of bg color
            if abs(item[0] - r_bg) <= tolerance and \
               abs(item[1] - g_bg) <= tolerance and \
               abs(item[2] - b_bg) <= tolerance:
                # Replace with transparent
                new_data.append((255, 255, 255, 0))
            else:
                new_data.append(item)
                
        img.putdata(new_data)
        img.save(output_path, "PNG")
        print(f"Success! Saved to {output_path}")
    except Exception as e:
        print(f"Error processing image: {e}")
        sys.exit(1)

remove_background("learnx.png", "learnx.png")
