import cv2

camera = cv2.VideoCapture(0)

while True:
    success, frame = camera.read()

    if not success:
        break
    
    cv2.imshow(
        "COMPRAFACIL FACE DETECTION",
        frame
    )

    key = cv2.waitKey(1)

    if key == 27:  # ESC key
        break

camera.release()
cv2.destroyAllWindows()