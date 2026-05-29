import cv2
import face_recognition

known_image = face_recognition.load_image_file(
    "storage/faces/ethan.jpeg"
)

known_enconding = face_recognition.face_encodings(
    known_image
)[0]

camera = cv2.VideoCapture(
    0,
    cv2.CAP_DSHOW
)

camera.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

frame_count = 0
current_label = "SCANNING..."
current_color = (255, 255, 0)


while True:
    success, frame = camera.read()

    if not success:
        break

    frame_count += 1

    if frame_count % 5 != 0:
        rgb_frame = cv2.cvtColor(
            frame,
            cv2.COLOR_BGR2RGB
        )

        face_locations = face_recognition.face_locations(
            rgb_frame
        )

        face_encodings = face_recognition.face_encodings(
            rgb_frame,
            face_locations
        )

        for (top, right, bottom, left), face_encoding in zip(
            face_locations,
            face_encodings
        ):
        
            matches = face_recognition.compare_faces(
                [known_enconding],
                face_encoding
            )

            if True in matches:
                label = "Ethan - ACCESS GRANTED"
                color = (0, 255, 0)
            else:
                label = "Unknown - ACCESS DENIED"
                color = (0, 0, 255)


            cv2.rectangle(
                frame,
                (left, top),
                (right, bottom),
                color,
                2
            )

            cv2.putText(
                frame,
                label,
                (left, top - 10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                color,
                2
            )

    cv2.imshow(
        "COMPRAFACIL FACE RECOGNITION",
        frame
    )

    key = cv2.waitKey(1)

    if key == 27:  # ESC key
        break

camera.release()

cv2.destroyAllWindows()