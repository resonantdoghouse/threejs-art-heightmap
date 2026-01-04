# Three.js Art Heightmap

A 3D visualization experiment that transforms 2D artworks into dynamic 3D landscapes. This application fetches high-resolution images from the [Art Institute of Chicago API](https://api.artic.edu/) and generates real-time heightmaps based on image data.

## Features

- **Art Exploration**: Search the vast collection of the Art Institute of Chicago.
- **3D Transformation**: Automatically converts 2D images into 3D terrains using client-side canvas processing.
- **Interactive Viewer**: innovative 3D controls to orbit, zoom, and explore the artwork.
- **Heightmap Customization**: Real-time controls (via Leva) to adjust:
  - Displayment Scale
  - Smoothing
  - Contrast
  - Lighting (Position & Intensity)

## Tech Stack

- **Core**: React, TypeScript, Vite
- **3D Engine**: Three.js, React Three Fiber (R3F), Drei
- **UI/Controls**: Leva, HTML/CSS overlay
- **Data Source**: Art Institute of Chicago Public API

## Setup

1.  **Install Dependencies**

    ```bash
    npm install
    ```

2.  **Run Locally**

    ```bash
    npm run dev
    ```

    Open `http://localhost:5173` (or the port shown in your terminal).

3.  **Build for Production**
    ```bash
    npm run build
    ```
