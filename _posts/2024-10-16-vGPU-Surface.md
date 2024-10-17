---
layout: post
title: WSL vGPU Surface Pro X SQ2
categories: [linux, wsl2, windows, mesa, vGPU]
date: 2024-10-16
---

This post is not official guidance or recommendations by any means, but more just a note to self on what I did to get vGPU working on my Surface Pro X SQ2... and Surface Laptop Studio 1. Follow at your own risk (I reimage my devices frequently...).

## Surface Pro X SQ2

I'm not the one who figured this out, an issue comment by [mmichal3](https://github.com/microsoft/wslg/issues/474#issuecomment-1722559128) provided instructions on how to pull this off using drivers from Lenovo.

The quick instructions are:
1. Download the Adreno Driver for the [Snapdragon 8cx Gen3](https://www.qualcomm.com/products/mobile/snapdragon/laptops-and-tablets/snapdragon-mobile-compute-platforms/snapdragon-8cx-gen-3-compute-platform#Software) and install it.
2. Open up device manager (win+x, m) and update the display driver to the 8cx Gen3 GPU driver (this... will require a reboot).
  a. This requires manually selecting the driver in the list of "Unsupported Drivers" and it'll be under the Qualcomm drivers.
3. Find out that the driver doesn't work with the Surface Pro X SQ2 (I skimmed the original instructions as was disappointed here 😅).
4. Open up device manager again and manually select the Adreno 690 driver from the list of supported drivers.
5. Open up a WSL distro that has a version of mesa that has d3d12 support installed.
6. Run `glxinfo -B` and see that vGPU is supported.

```sh
$ glxinfo -B
display: :0  screen: 0
direct rendering: Yes
Extended renderer info (GLX_MESA_query_renderer):
    Vendor: Microsoft Corporation (0xffffffff)
    Device: D3D12 (Qualcomm(R) Adreno(TM) 680 GPU) (0xffffffff)
    Version: 24.2.4
    Accelerated: yes
    Video memory: 7921MB
    Unified memory: yes
    Preferred profile: core (0x1)
    Max core profile version: 4.1
    Max compat profile version: 4.1
    Max GLES1 profile version: 1.1
    Max GLES[23] profile version: 3.0
OpenGL vendor string: Microsoft Corporation
OpenGL renderer string: D3D12 (Qualcomm(R) Adreno(TM) 680 GPU)
OpenGL core profile version string: 4.1 (Core Profile) Mesa 24.2.4
OpenGL core profile shading language version string: 4.10
OpenGL core profile context flags: (none)
OpenGL core profile profile mask: core profile

OpenGL version string: 4.1 (Compatibility Profile) Mesa 24.2.4
OpenGL shading language version string: 4.10
OpenGL context flags: (none)
OpenGL profile mask: compatibility profile

OpenGL ES profile version string: OpenGL ES 3.0 Mesa 24.2.4
OpenGL ES profile shading language version string: OpenGL ES GLSL ES 3.00
```

That said, I'm not sure if I see the same results shared in the [issue thread](https://github.com/microsoft/wslg/issues/474#issuecomment-1722559128), but it's fun to see it kind of working.

## Surface Laptop Studio 1

For the Surface Laptop Studio 1, you have 2 graphic adapters, the integrated Intel Iris Xe, and the NVIDIA GPU. For the longest time I only thought the NVIDIA GPU was usable for vGPU.

To use the Intel Iris, I had to update the [driver from Intel](https://www.intel.com/content/www/us/en/download/785597/intel-arc-iris-xe-graphics-windows.html). **Warning**: There are some warnings that Microsoft customizes the drivers for the Surface Laptop Studio 1, so use at your own risk. I'm not sure what breaks (if anything).

To use the NVIDIA GPU, I installed the [NVIDIA App](https://www.nvidia.com/en-us/software/nvidia-app/) (you can also use [Geforce Experience](https://www.nvidia.com/en-us/geforce/geforce-experience/download/), but the NVIDIA App doesn't require sign in) and updated to the latest driver.

Once you have the drivers installed, the Intel one _may_ be the default selected, and you can specify which device to use using `MESA_D3D12_DEFAULT_ADAPTER_NAME=INTEL` or `MESA_D3D12_DEFAULT_ADAPTER_NAME=NVIDIA`. You can set this in a config for your shell, or just set it before running specific commands.

Intel Iris Xe:

```sh
$ glxinfo -B
name of display: :0
display: :0  screen: 0
direct rendering: Yes
Extended renderer info (GLX_MESA_query_renderer):
    Vendor: Microsoft Corporation (0xffffffff)
    Device: D3D12 (Intel(R) Iris(R) Xe Graphics) (0xffffffff)
    Version: 24.2.4
    Accelerated: yes
    Video memory: 16429MB
    Unified memory: yes
    Preferred profile: core (0x1)
    Max core profile version: 4.1
    Max compat profile version: 4.1
    Max GLES1 profile version: 1.1
    Max GLES[23] profile version: 3.0
OpenGL vendor string: Microsoft Corporation
OpenGL renderer string: D3D12 (Intel(R) Iris(R) Xe Graphics)
OpenGL core profile version string: 4.1 (Core Profile) Mesa 24.2.4
OpenGL core profile shading language version string: 4.10
OpenGL core profile context flags: (none)
OpenGL core profile profile mask: core profile

OpenGL version string: 4.1 (Compatibility Profile) Mesa 24.2.4
OpenGL shading language version string: 4.10
OpenGL context flags: (none)
OpenGL profile mask: compatibility profile

OpenGL ES profile version string: OpenGL ES 3.0 Mesa 24.2.4
OpenGL ES profile shading language version string: OpenGL ES GLSL ES 3.00
```

NVIDIA:

```sh
$ MESA_D3D12_DEFAULT_ADAPTER_NAME=NVIDIA glxinfo -B
name of display: :0
display: :0  screen: 0
direct rendering: Yes
Extended renderer info (GLX_MESA_query_renderer):
    Vendor: Microsoft Corporation (0xffffffff)
    Device: D3D12 (NVIDIA GeForce RTX 3050 Ti Laptop GPU) (0xffffffff)
    Version: 24.2.4
    Accelerated: yes
    Video memory: 20266MB
    Unified memory: no
    Preferred profile: core (0x1)
    Max core profile version: 4.6
    Max compat profile version: 4.6
    Max GLES1 profile version: 1.1
    Max GLES[23] profile version: 3.1
OpenGL vendor string: Microsoft Corporation
OpenGL renderer string: D3D12 (NVIDIA GeForce RTX 3050 Ti Laptop GPU)
OpenGL core profile version string: 4.6 (Core Profile) Mesa 24.2.4
OpenGL core profile shading language version string: 4.60
OpenGL core profile context flags: (none)
OpenGL core profile profile mask: core profile

OpenGL version string: 4.6 (Compatibility Profile) Mesa 24.2.4
OpenGL shading language version string: 4.60
OpenGL context flags: (none)
OpenGL profile mask: compatibility profile

OpenGL ES profile version string: OpenGL ES 3.1 Mesa 24.2.4
OpenGL ES profile shading language version string: OpenGL ES GLSL ES 3.10
```

## Conclusion

Some of the odd stuff I find, is I don't think I actually do anything that benefits from setting up vGPU 🤣. I just... really wanted to make sure I had it. (I'm curious if it helps with gaming in WSL...)

You'll find that some problems run worse with vGPU vs software rendering. Some things run way faster on the integrated graphics vs GPU.