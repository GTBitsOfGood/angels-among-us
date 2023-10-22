import { IUser } from "../utils/types/user";
import {
  Trained,
  IPost,
  FosterType,
  fosterTypeLabels,
  sizeLabels,
  breedLabels,
  genderLabels,
  ageLabels,
  medicalLabels,
  behavioralLabels,
  goodWithLabels,
  Size,
  Gender,
  Age,
  GoodWith,
  Medical,
} from "../utils/types/post";

const propertyLabels = {
  getsAlongWithMen: "Men",
  getsAlongWithWomen: "Women",
  getsAlongWithOlderKids: "Older children",
  getsAlongWithYoungKids: "Younger children",
  getsAlongWithLargeDogs: "Large dogs",
  getsAlongWithSmallDogs: "Small dogs",
  getsAlongWithCats: "Cats",
} as Record<keyof IPost, string>;

function goodWith(post: IPost, isGood: boolean) {
  const check = isGood ? Trained.Yes : Trained.No;
  const retArr = Object.keys(propertyLabels)
    .filter((propertyName) => post[propertyName as keyof IPost] === check)
    .map((propertyName) => propertyLabels[propertyName as keyof IPost]);
  return retArr;
}

function bestAttachment(post: IPost) {
  const attachments = post.attachments;
  const imageExtensions = /\.(jpg|jpeg|png)$/i;
  for (let i = 0; i < attachments.length; i++) {
    if (imageExtensions.test(attachments[i])) {
      return attachments[i];
    }
  }
}

export function emailTemplate(post: IPost, user: IUser) {
  return `<!DOCTYPE html>
        <html>
          <head>
            <title>Email</title>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link
              href="https://fonts.googleapis.com/css2?family=Comfortaa&family=Roboto:ital,wght@0,400;0,500;0,700;1,400&display=swap"
              rel="stylesheet"
            />
            <style>
            body {
                font-family: "Comfortaa", cursive;
                font-family: "Roboto", sans-serif;
              }
        
              .email {
                width: 1075px;
                margin: auto;
              }
        
              .logo {
                padding: 50px 0px 30px;
                width: 46px;
                height: 49px;
                margin: 0% 50%;
              }
        
              .logo-div {
                width: 100%;
              }
        
              .congrats-text {
                line-height: 48px;
                display: inline-block;
                margin-left: 14px;
                margin-right: 14px;
              }
        
              .pet-info {
                margin: 36px 14px;
              }
        
              table.pet-info td,
              table.info-table td {
                vertical-align: top;
              }
        
              .pet-name-text {
                margin-top: 8px;
              }
        
              .pet-about-text {
                color: #656565;
              }
        
              .info-table {
                border-collapse: separate;
                border-spacing: 15px;
                width: 100%;
                margin-bottom: 40px;
              }
        
              table.info-table tr {
                outline: #7d7e82 thin solid;
              }
        
              table.info-table tr:first-child {
                outline: none;
              }
        
              table.info-table td:first-child {
                background-color: #c6e3f9;
                font-weight: 500;
                width: 25%;
              }
        
              table.info-table td:nth-child(3) {
                border-left: #7d7e82 thin solid;
              }
        
              table.info-table td {
                font-size: 22px;
                padding: 12px 15px;
              }
        
              table.info-table th {
                text-align: left;
                font-weight: 500;
                font-size: 24px;
              }
        
              .medium-weight-text {
                font-weight: 500;
              }
        
              .bold-text {
                font-weight: 700;
              }
        
              .font-24px {
                font-size: 24px;
                margin-bottom: 0px;
              }
        
              .font-28px {
                font-size: 28px;
                margin-bottom: 0px;
              }
        
              .font-22px {
                font-size: 22px;
                margin-top: 0px;
                margin-bottom: 0px;
              }
        
              .font-20px {
                font-size: 20px;
                margin-top: 0px;
                margin-bottom: 0px;
                font-style: italic;
              }
        
              .italic-cell-header {
                font-style: italic;
              }
        
              .space-above {
                margin-top: 12px;
              }
        
              .questionnaire-responses {
                padding-bottom: 50px;
                margin-left: 14px;
                margin-right: 14px;
              }
        
              .question {
                font-size: 22px;
                padding-bottom: 2px;
              }
        
              .question-title {
                margin-bottom: 8px;
              }
        
              .question-response {
                margin: 0px;
              }
        
              .pet-image {
                width: 250px;
                height: 250px;
                object-fit: cover;
                aspect-ratio: 1/1;
                border-radius: 12px;
                margin-right: 20px;
              }
        
              .pet-about-header {
                margin: 18px 0px;
              }
            </style>
          </head>
          <body>
          <div class="email">
          <div class="logo-div">
            <img class="logo" src="https://i.imgur.com/Frk3oH3.png" />
          </div>
              <p class="medium-weight-text font-24px congrats-text">
                Congratulations!<br />
                There is a new foster application for the dog below to review.
              </p>
              <table class="pet-info">
                <tr>
                  <td>
                    <img
                      class="pet-image"
                      src=${
                        post.attachments && bestAttachment(post)
                          ? bestAttachment(post)
                          : "https://i.imgur.com/X36GXXo.png"
                      }
                    />
                  </td>
                  <td>
                    <div class="pet-info-text">
                      <p class="pet-name-text medium-weight-text font-28px">${
                        post.name
                      }</p>
                      <p class="pet-about-header bold-text font-22px">About</p>
                      <p class="pet-about-text font-22px">
                        ${post.description}
                      </p>
                    </div>
                  </td>
                </tr>
              </table>
              <div class="volunteer-info">
                <table class="info-table">
                  <tr>
                    <th>About the Volunteer</th>
                  </tr>
                  <tr>
                    <td>Name:</td>
                    <td>${user.name}</td>
                  </tr>
                  <tr>
                    <td>Email:</td>
                    <td>${user.email}</td>
                  </tr>
                  <tr>
                    <td>Preferred Email:</td>
                    <td>${
                      user.preferredEmail ? user.preferredEmail : user.email
                    }</td>
                  </tr>
                </table>
              </div>
              <div class="preferences-info">
                <table class="info-table">
                  <tr>
                    <th>Preferences & Info</th>
                    <th>Volunteer Preferences</th>
                    <th>Dog Information</th>
                  </tr>
                  <tr>
                    <td>Foster Type:</td>
                    <td>${
                      user.type && user.type.length != 0
                        ? user.type.length == Object.keys(FosterType).length
                          ? "All"
                          : user.type
                              .map((item) => fosterTypeLabels[item])
                              .join(", ")
                        : "None"
                    }</td>
                    <td>${fosterTypeLabels[post.type]}</td>
                  </tr>
                  <tr>
                    <td>Size:</td>
                    <td>${
                      user.size && user.size.length != 0
                        ? user.size.length == Object.keys(Size).length
                          ? "All"
                          : user.size.map((size) => sizeLabels[size]).join(", ")
                        : "None"
                    }</td>
                    <td>${sizeLabels[post.size]}</td>
                  </tr>
                  <tr>
                    <td>Breed:</td>
                    <td>
                      <p class="font-20px">Preferred Breeds:</p>
                      ${
                        user.preferredBreeds && user.preferredBreeds.length != 0
                          ? user.preferredBreeds
                              .map((breed) => breedLabels[breed])
                              .join(", ")
                          : "None"
                      }
        
                      <p class="font-20px space-above">Restricted Breeds:</p>
                      ${
                        user.restrictedBreeds &&
                        user.restrictedBreeds.length != 0
                          ? user.restrictedBreeds
                              .map((breed) => breedLabels[breed])
                              .join(", ")
                          : "None"
                      }
                    </td>
                    <td>${post.breed
                      .map((breed) => breedLabels[breed])
                      .join(", ")}</td>
                  </tr>
                  <tr>
                    <td>Gender:</td>
                    <td>${
                      user.gender && user.gender.length != 0
                        ? user.gender.length == Object.keys(Gender).length
                          ? "All"
                          : user.gender
                              .map((gender) => genderLabels[gender])
                              .join(", ")
                        : "None"
                    }</td>
                    <td>${genderLabels[post.gender]}</td>
                  </tr>
                  <tr>
                    <td>Age:</td>
                    <td>${
                      user.age && user.age.length != 0
                        ? user.age.length == Object.keys(Age).length
                          ? "All"
                          : user.age.map((age) => ageLabels[age]).join(", ")
                        : "None"
                    }</td>
                    <td>${ageLabels[post.age]}</td>
                  </tr>
                  <tr>
                    <td>Dog Not Good With:</td>
                    <td>
                      <p class="font-20px">Can foster dogs NOT good with:</p>
                      ${
                        user.dogsNotGoodWith && user.dogsNotGoodWith.length != 0
                          ? user.dogsNotGoodWith.length ==
                            Object.keys(GoodWith).length
                            ? "All"
                            : user.dogsNotGoodWith
                                .map((goodWith) => goodWithLabels[goodWith])
                                .join(", ")
                          : "None"
                      }
                    </td>
                    <td>
                      <p class="font-20px">Dog is NOT good with:</p>
                      ${goodWith(post, false).join(", ")}
                      <p class="font-20px space-above">Dog is good with:</p>
                      ${goodWith(post, true).join(", ")}
                    </td>
                  </tr>
                  <tr>
                    <td>Medical:</td>
                    <td>
                      <p class="font-20px">Able to foster dogs with:</p>
                      ${
                        user.medical && user.medical.length != 0
                          ? user.medical.length == Object.keys(Medical).length
                            ? "All"
                            : user.medical
                                .map((med) => medicalLabels[med])
                                .join(", ")
                          : "None"
                      }
                    </td>
                    <td>
                      <p class="font-20px">Dog has:</p>
                      ${
                        post.medical && post.medical.length != 0
                          ? post.medical
                              .map((med) => medicalLabels[med])
                              .join(", ")
                          : "None"
                      }
                    </td>
                  </tr>
                  <tr>
                    <td>Behavioral:</td>
                    <td>
                      <p class="font-20px">Able to foster dogs with:</p>
                      ${
                        user.behavioral && user.behavioral.length != 0
                          ? user.behavioral.length == 6
                            ? "All"
                            : user.behavioral
                                .map(
                                  (behavioral) => behavioralLabels[behavioral]
                                )
                                .join(", ")
                          : "None"
                      }
                    </td>
                    <td>
                      <p class="font-20px">Dog has:</p>
                      ${
                        post.behavioral && post.behavioral.length != 0
                          ? post.behavioral
                              .map((behavioral) => behavioralLabels[behavioral])
                              .join(", ")
                          : "None"
                      }
                    </td>
                  </tr>
                </table>
              </div>
              <div class="questionnaire-responses">
                <p class="medium-weight-text font-24px">
                  Foster Questionnaire Responses
                </p>
                <div class="question">
                  <p class="medium-weight-text question-title">Placeholder Question</p>
                  <p class="question-response">Response to question</p>
                </div>
                <div class="question">
                  <p class="medium-weight-text question-title">Placeholder Question</p>
                  <p class="question-response">Response to question</p>
                </div>
                <div class="question">
                  <p class="medium-weight-text question-title">Placeholder Question</p>
                  <p class="question-response">Response to question</p>
                </div>
                <div class="question">
                  <p class="medium-weight-text question-title">Placeholder Question</p>
                  <p class="question-response">Response to question</p>
                </div>
                <div class="question">
                  <p class="medium-weight-text question-title">Placeholder Question</p>
                  <p class="question-response">Response to question</p>
                </div>
              </div>
            </div>
          </body>
        </html>
        `;
}
