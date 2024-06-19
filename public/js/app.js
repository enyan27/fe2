const state = {
    currentPage: 1,
    totalImages: 0,
    loadedImages: 0
};

const fetchJSON = async (url, options) => {
    const response = await fetch(url, options);
    return response.json();
};

const getRandomPosition = (max) => Math.floor(Math.random() * max);

const createBox = ({ id, src, loves, clicks }, container) => {
    const box = document.createElement('div');
    box.className = 'box';
    // Đề 1:
    box.dataset.bsToggle = 'modal';
    box.dataset.bsTarget = '#exampleModal';
    // End Đề 1;
    box.dataset.id = id;

    box.style.top = `${getRandomPosition(container.clientHeight - 190)}px`;
    box.style.left = `${getRandomPosition(container.clientWidth - 150)}px`;
    const translateZ = getRandomPosition(300);
    box.style.transform = `translateZ(${translateZ}px)`;
    box.style.filter = `brightness(${0.1 + (translateZ / 300)})`;

    const picture = document.createElement('div');
    picture.className = 'picture';
    picture.style.backgroundImage = `url('public/images/${src}')`;
    box.appendChild(picture);

    const bar = document.createElement('div');
    bar.className = 'bar';

    const createButton = (className, icon, text) => {
        const button = document.createElement('button');
        button.className = className;
        button.innerHTML = `<i class="bi ${icon}"></i><span>${text}</span>`;
        return button;
    };

    const btnLoves = createButton('btn-loves', 'bi-heart-fill', loves);
    btnLoves.id = `loves-${id}`;
    bar.appendChild(btnLoves);

    const btnClicks = createButton('btn-clicks', 'bi-eye-fill', clicks);
    btnClicks.id = `clicks-${id}`;
    bar.appendChild(btnClicks);

    box.appendChild(bar);
    container.appendChild(box);

    // Đề 2:
    btnLoves.addEventListener('click', async (e) => {
        e.preventDefault();
        const success = await incrementLoves(id);
        if (success) {
            const lovesSpan = btnLoves.querySelector('span');
            lovesSpan.textContent = parseInt(lovesSpan.textContent) + 1;
        }
    });
     // End Đề 2;

    // Đề 1:
    btnClicks.addEventListener('click', async (e) => {
        e.preventDefault();
        const success = await incrementClicks(id);
        if (success) {
            const clicksSpan = btnClicks.querySelector('span');
            clicksSpan.textContent = parseInt(clicksSpan.textContent) + 1;
        }
    });
    // End Đề 1;
};

const createBoxesFromData = async (container, page) => {
    const { images, total } = await fetchJSON(`app/api/loadmore.php?page=${page}`);
    state.totalImages = total;
    state.loadedImages += images.length;

    document.querySelector('.loadmore').style.display = (images.length === 0 || state.loadedImages >= state.totalImages) ? 'none' : 'block';
    images.forEach(image => createBox(image, container));
};

// Đề 1:
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
// End Đề 1;

// Đề 1:
const incrementClicks = async (id) => {
    const formData = new FormData();
    formData.append('id', id);

    const response = await fetch(`app/api/incrementClicks.php`, {
        method: 'POST',
        body: formData
    });

    return response.ok;
};
// End Đề 1;

// Đề 2:
const incrementLoves = async (id) => {
    const formData = new FormData();
    formData.append('id', id);

    const response = await fetch(`app/api/incrementLoves.php`, {
        method: 'POST',
        body: formData
    });

    return response.ok;
};
// End Đề 2;

// Đề 2:
const handleSearch = async (e, container) => {
    e.preventDefault();
    const keyword = e.target.querySelector('input').value.trim();
    container.innerHTML = '';
    if (keyword) {
        const { images } = await fetchJSON(`app/api/search.php?keyword=${keyword}`);
        if (images.length) {
            images.forEach(image => createBox(image, container));
        } else {
            alert('Không tìm thấy kết quả nào.');
        }
        document.querySelector('.loadmore').style.display = 'none';
    } else {
        state.currentPage = 1;
        state.loadedImages = 0;
        await createBoxesFromData(container, state.currentPage);
    }
};
// End Đề 2;

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.my-container');
    createBoxesFromData(container, state.currentPage);

    document.querySelector('.loadmore').addEventListener('click', () => {
        state.currentPage++;
        createBoxesFromData(container, state.currentPage);
    });

    // Đề 2:
    document.querySelector('.search-bar form').addEventListener('submit', (e) => handleSearch(e, container));
    // End Đề 2;

    // Đề 1:
    container.addEventListener('click', async (event) => {
        const box = event.target.closest('.box');
        if (box) {
            const imageDetails = await fetchJSON(`app/api/getImageDetails.php?id=${box.dataset.id}`);
            showImageDetails(imageDetails);
            const success = await incrementClicks(box.dataset.id);
            if (success) {
                const clicksSpan = document.querySelector(`#clicks-${box.dataset.id} span`);
                clicksSpan.textContent = parseInt(clicksSpan.textContent) + 1;
            }
        }
    });
    // End Đề 1;
});

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
