window.addEventListener("DOMContentLoaded", getListData);
const leaderboardList = document.getElementById("leaderboard-list");
const downloadList = document.getElementById("download-list-items");
const userName = document.querySelector(".UserName");
const premiumStatus = document.getElementById("premium-status");
const signOutBtn = document.getElementById("signout-btn");

signOutBtn.addEventListener("click", signOut);

const userDetails = JSON.parse(localStorage.getItem("User Details"));
userName.innerHTML = `<p style="margin:0px">${userDetails.name}</p>`;

async function getListData() {
  updateLinks();
  if (leaderboardList) {
    try {
      leaderboardList.innerHTML = "";
      const response = await axios.get(
        "https://localhost:3000/getLeaderboard",
        {
          headers: {
            authorization: localStorage.getItem("Authorization"),
          },
        }
      );
      for (listData of response.data.leaderboardList) {
        leaderboardList.innerHTML += `<li class="list-group-item list-group-item-primary">Name: ${
          listData.name
        } Total Expense: ${
          listData.totalAmount ? listData.totalAmount : 0
        }</li>`;
      }
    } catch (error) {
      console.log("Error:", error);
    }
  } else if (downloadList) {
    try {
      const response = await axios.get(
        "https://localhost:3000/getExpenseDownloadsList",
        {
          headers: {
            authorization: localStorage.getItem("Authorization"),
          },
        }
      );
      const downloadedItems = response.data.downloadList;
      downloadedItems.forEach((item, id) => {
        const date = new Date(item.createdAt).toLocaleDateString();
        downloadList.innerHTML += `<tr>
        <td>${id + 1}</td>
        <td>${date}</td>
        <td><button type="button"
        class="btn btn-success btn-sm"><a style="color:white" href="${
          item.fileUrl
        }">Download</a></button></td>
        </tr>`;
      });
    } catch (error) {
      console.log("Error:", error);
    }
  }
}

function updateLinks() {
  const token = localStorage.getItem("Authorization");
  const tokenData = parseJwt(token);
  const membership = tokenData.isPremium;
  premiumStatus.style.display = membership ? "block" : "none";
}

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

function signOut() {
  localStorage.clear();
  location.href = "../index.html";
}
