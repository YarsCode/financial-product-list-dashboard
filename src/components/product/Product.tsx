import { ProductType } from "../../types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import arrowDownIcon from "../../assets/arrowDown.svg";
// import { addCommasToNumber } from "../../utils/numberManipulations";
import { useEffect, useRef, useState } from "react";

interface Props {
    product: ProductType;
    className: string;
    openDescriptionOnClick?: () => void;
}

function Product({ product, className }: Props) {
    const [isDescOpen, setIsDescOpen] = useState(false);
    const [defaultDescMinHeight] = useState(76);
    const [defaultNameMarginTop] = useState(0);

    const productLiRef = useRef<HTMLLIElement | null>(null);
    const productNameRef = useRef<HTMLParagraphElement>(null);
    const productDescRef = useRef<HTMLParagraphElement>(null);
    // const [productMinHeight, setProductMinHeight] = useState(76);

    useEffect(() => {
        if (productLiRef.current) {
            productLiRef.current.offsetHeight;
        }
    }, [product]);

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: product.id,
        data: {
            type: "Product",
            product,
        },
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    if (isDragging) {
        return (
            <li className="product--drag-overlay" ref={setNodeRef} style={style}>
                <p className="product__name">{product.name}</p>
                {isDescOpen && <p className="product__desc">{product.description}</p>}
            </li>
        );
    }

    const openDescriptionOnClick = () => {
        if (productLiRef.current && productNameRef.current && productDescRef.current) {
            productDescRef.current.classList.toggle('product__desc--expanded');
            const totalHeight = productNameRef.current?.offsetHeight + productDescRef.current?.offsetHeight;
            
            if (isDescOpen) {
                productLiRef.current.style.minHeight = `${defaultDescMinHeight}px`;
                productNameRef.current.style.marginTop = `${defaultNameMarginTop}px`;
            } else {
                productLiRef.current.style.minHeight = `${totalHeight + 32}px`;
                productNameRef.current.style.marginTop = "12px";
            }
        }
        setIsDescOpen(!isDescOpen);
    };

    return (
        // <li ref={setNodeRef} style={style} {...attributes} {...listeners} className={isDescOpen ? className + " product--max-width-100" : className}>
        <li ref={(node) => {setNodeRef(node); productLiRef.current = node; }} style={style} {...attributes} {...listeners} className={className}>
            <p className="product__name" ref={productNameRef}>{product.name}</p>
            <p className="product__desc" ref={productDescRef}>{product.description}</p>
            {/* <p className="product__price">
                עלות: <span>₪{addCommasToNumber(product.price)}</span>
            </p> */}
            <div className="product__show-desc-btn" onClick={openDescriptionOnClick}>
                <img src={arrowDownIcon} alt="Open" />
            </div>
        </li>
    );
}

export default Product;
