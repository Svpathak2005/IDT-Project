async function fetchNFTs() {
  try {
    const address = localStorage.getItem("address");

    const response = await fetch("/fetch_nfts/" + address);

    const data = await response.json();

    // Update the total NFTs count

    document.getElementById("total-nfts").textContent +=
      " " + data["total-nfts"];

    // Create grid elements for each NFT, but set image src to a placeholder

    const nftGrid = document.querySelector(".nft-grid");

    data.nfts.forEach((nft) => {
      const nftItem = document.createElement("div");

      nftItem.classList.add("nft-item");

      // Handle cases where title, description, or image URL might be missing

      nftItem.innerHTML = `
  
        <img src="placeholder.jpg" alt="${
          nft.title || "NFT Image"
        }" data-src="${nft.imageUrl}">
  
          <h2>${nft.title || "No Title"}</h2>
  
          <p>${nft.description || "No Description"}</p>
  
        `;

      nftGrid.appendChild(nftItem);
    });

    // Observe intersection of NFT items with viewport

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const nftItem = entry.target;

          const image = nftItem.querySelector("img");

          image.src = image.getAttribute("data-src");

          observer.unobserve(nftItem);
        }
      });
    });

    // Observe all NFT items

    nftGrid.querySelectorAll(".nft-item").forEach((nftItem) => {
      observer.observe(nftItem);
    });
  } catch (error) {
    console.error("Error fetching NFTs:", error);
  }
}

fetchNFTs();
