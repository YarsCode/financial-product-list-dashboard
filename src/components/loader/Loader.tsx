interface Props {
    imgSrc: string;
}

function Loader({ imgSrc }: Props) {
    return (
        <div className="loader-img-container">
            <img
                width="800"
                height="490"
                src="https://www.financialplanning.co.il/wp-content/uploads/2023/02/לוגו-עם-אייקון-future-תכנון-פיננסי-1024x627.webp"
                className="loader-img"
                alt="לוגו עם אייקון future תכנון פיננסי"
                srcSet={imgSrc}
                sizes="(max-width: 800px) 100vw, 800px"
                data-node-item="1676"
            ></img>
        </div>
    );
}

export default Loader;
