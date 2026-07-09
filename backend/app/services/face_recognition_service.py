import face_recognition
import tempfile
import os

from sqlalchemy.orm import Session

from app.models.user import User


def recognize_face(uploaded_image, db: Session):

    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
    temp_file.write(uploaded_image.file.read())
    temp_file.close()

    try:
        unknown_image = face_recognition.load_image_file(temp_file.name)
        unknown_encodings = face_recognition.face_encodings(unknown_image)

        if not unknown_encodings:
            return None

        unknown_encoding = unknown_encodings[0]

        users = db.query(User).filter(User.is_active == True).all()

        best_user = None
        best_distance = 1

        for user in users:
            if not user.face_image:
                continue

            known_image = face_recognition.load_image_file(user.face_image)
            known_encodings = face_recognition.face_encodings(known_image)

            if not known_encodings:
                continue

            distance = face_recognition.face_distance(
                [known_encodings[0]], unknown_encoding
            )[0]

            if distance < best_distance:
                best_distance = distance
                best_user = user

        if best_user is None or best_distance > 0.5:
            return None

        confidence = float(round((1 - best_distance) * 100, 2))

        return {"user": best_user, "confidence": confidence}

    finally:
        if os.path.exists(temp_file.name):
            os.remove(temp_file.name)