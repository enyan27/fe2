const state = {
    currentPage: 1,
    totalImages: 0,
    loadedImages: 0
};

document.addEventListener('mousemove', ({ clientX, clientY }) => {
    const front = document.querySelector('.front');
    const container = document.querySelector('.my-container');
    const { left, top, width, height } = container.getBoundingClientRect();
    
    const containerCenterX = left + width / 2;
    const containerCenterY = top + height / 2;
    
    const deltaX = clientX - containerCenterX;
    const deltaY = clientY - containerCenterY;
    
    const rotateX = (deltaY / window.innerHeight) * 60;
    const rotateY = (deltaX / window.innerWidth) * -60;
    
    container.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    front.style.transform = `rotateX(${rotateX / 3}deg) rotateY(${rotateY / 3}deg)`;
});

const createBox = ({ id, src, loves, clicks }, container) => {
    const box = document.createElement('div');
    box.className = 'box';
    box.dataset.bsToggle = 'modal';
    box.dataset.bsTarget = '#exampleModal';
    box.dataset.id = id;

    box.style.top = `${getRandomPosition(container.clientHeight - 190)}px`;
    box.style.left = `${getRandomPosition(container.clientWidth - 150)}px`;
    
    const translateZ = getRandomPosition(300);
    box.style.transform = `translateZ(${translateZ}px)`;
    box.style.filter = `brightness(${0.1 + (translateZ / 200)})`;

    const picture = document.createElement('div');
    picture.className = 'picture';
    picture.style.backgroundImage = `url('public/images/${src}')`;
    picture.style.backgroundSize = 'cover';
    picture.style.backgroundPosition = 'center';
    box.appendChild(picture);

    const bar = document.createElement('div');
    bar.className = 'bar';

    const btnLoves = document.createElement('button');
    btnLoves.className = 'btn-loves';
    btnLoves.id = `loves-${id}`;
    btnLoves.innerHTML = `<i class="bi bi-heart-fill"></i><span>${loves}</span>`;
    bar.appendChild(btnLoves);

    const btnClicks = document.createElement('button');
    btnClicks.className = 'btn-clicks';
    btnClicks.id = `clicks-${id}`;
    btnClicks.innerHTML = `<i class="bi bi-eye-fill"></i><span>${clicks}</span>`;
    bar.appendChild(btnClicks);

    box.appendChild(bar);
    container.appendChild(box);
    
    btnLoves.addEventListener('click', async (e) => { // Sự kiện tăng lượt loves
        e.preventDefault();
        const success = await incrementLoves(id);
        if (success) {
            const lovesSpan = btnLoves.querySelector('span');
            lovesSpan.textContent = parseInt(lovesSpan.textContent) + 1;
        }
    });
};

const createBoxesFromData = async (container, page) => {
    const { images, total } = await loadMore(page);
    state.totalImages = total;
    state.loadedImages += images.length;
    
    if (images.length === 0 || state.loadedImages >= state.totalImages) {
        document.querySelector('.loadmore').style.display = 'none';
    } else {
        document.querySelector('.loadmore').style.display = 'block';
    }
    
    images.forEach(image => createBox(image, container));
};

const loadMore = async (page) => {
    const response = await fetch(`app/api/loadmore.php?page=${page}`);
    return response.json();
};

const searchImages = async (keyword) => {
    const response = await fetch(`app/api/search.php?keyword=${keyword}`);
    return response.json();
};

const getImageDetails = async (id) => {
    const response = await fetch(`app/api/getImageDetails.php?id=${id}`);
    return response.json();
};

const incrementClicks = async (id) => {
    const formData = new FormData();
    formData.append('id', id);

    const response = await fetch(`app/api/incrementClicks.php`, {
        method: 'POST',
        body: formData
    });

    return response.ok;
};

const incrementLoves = async (id) => {
    const formData = new FormData();
    formData.append('id', id);

    const response = await fetch(`app/api/incrementLoves.php`, {
        method: 'POST',
        body: formData
    });
    
    return response.ok;
};

const showImageDetails = ({ name, src, content }) => {
    document.querySelector('#exampleModalLabel').textContent = name;
    document.querySelector('.modal-body').innerHTML = `
        <div class="row">
            <div class="col-6">
                <img src="public/images/${src}" alt="${name}" class="img-fluid">
            </div>
            <div class="col-6">
                <p>${content}</p>
            </div>
        </div>
    `;
};

const getRandomPosition = (max) => Math.floor(Math.random() * max);
// DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.my-container');
    createBoxesFromData(container, state.currentPage);
    
    document.querySelector('.loadmore').addEventListener('click', () => {
        state.currentPage++;
        createBoxesFromData(container, state.currentPage);
    });

    const searchForm = document.querySelector('.search-bar form');
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const keyword = searchForm.querySelector('input').value.trim();
        container.innerHTML = '';
        if (keyword) {
            const { images } = await searchImages(keyword);
            if (images.length > 0) {
                images.forEach(image => createBox(image, container));
                document.querySelector('.loadmore').style.display = 'none';
            } else {
                alert('Không tìm thấy kết quả nào.');
                document.querySelector('.loadmore').style.display = 'none';
            }
        } else {
            state.currentPage = 1;
            state.loadedImages = 0;
            await createBoxesFromData(container, state.currentPage);
        }
    });

    container.addEventListener('click', async (event) => {
        const box = event.target.closest('.box');
        const btnClicks = event.target.closest('.btn-clicks');

        if (box && !btnClicks) {
            const imageDetails = await getImageDetails(box.dataset.id);
            showImageDetails(imageDetails);
            const success = await incrementClicks(box.dataset.id);
            if (success) {
                const clicksSpan = document.querySelector(`#clicks-${box.dataset.id} span`);
                clicksSpan.textContent = parseInt(clicksSpan.textContent) + 1;
            }
        }
    });
});
