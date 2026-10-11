# Gather 0.9.14

- Camera studio: enable Green screen to reveal Upload background image.
- Pick a local JPG, PNG or WebP up to 10 MB and 40 megapixels. The selected image has a thumbnail, filename, Change and Remove controls.
- The background fills the camera frame with centered cropping. Keyed green pixels use the selected background in live preview, captured photos and canvas-recorded video. Camera color filters do not recolor the replacement background.
- Removing the image restores Gather purple. Turning the effect off preserves the selection for this camera-studio instance.
- Image decoding failures report an error and preserve the previous working background. Local object URLs are released when replaced or the camera studio unmounts.
- Previous 0.9.13 features remain included.

This feature is in the browser camera studio, including the iPhone website. Native capture continues to link to that studio for effects. It requires a physical green background; green clothing is also replaced. It does not automatically separate people from arbitrary surroundings. Background selections are local to this studio instance; resulting captures contain the composited image.

Validation: TypeScript, lint, automated tests and web export. Real-camera/iPhone visual and recording checks remain pending.
