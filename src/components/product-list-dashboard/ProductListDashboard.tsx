import { useEffect, useMemo, useState } from "react";
import { ContainerType, ProductType } from "../../types";
import ProductList from "../product-list/ProductList.tsx";
import refreshIcon from "../../assets/refreshIcon.svg";
import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import Product from "../product/Product.tsx";
import allContainers from "../../utils/containers.ts";
import { turnDataIntoObject } from "../../utils/productList.ts";
import Loader from "../loader/Loader.tsx";
import ExportButton from "../export-button/ExportButton.tsx";
import { addCommasToNumber } from "../../utils/numberManipulations.ts";
// import productList from "../../utils/productList.ts";

const { allProductsContainer, chosenProductsContainer } = allContainers;

const defaultAllProductsContainer: ContainerType[] = allProductsContainer;
const defaultChosenProductsContainer: ContainerType[] = chosenProductsContainer;

// const defaultProducts: ProductType[] = productList;

function ProductListDashboard() {
    // const [defaultProducts, setDefaultProducts] = useState<ProductType[]>([]);
    const [allProductsContainer, setAllProductsContainer] = useState<ContainerType[]>(defaultAllProductsContainer);
    const [hasClickedResetBtn, setHasClickedResetBtn] = useState(false);
    const [chosenProductsContainer] = useState<ContainerType[]>(defaultChosenProductsContainer);
    const [products, setProducts] = useState<ProductType[]>([]);
    const [step1Sum, setStep1Sum] = useState(0);
    const [step2Sum, setStep2Sum] = useState(0);
    const [totalSum, setTotalSum] = useState(step1Sum + step2Sum);
    const allProductsContainerId = useMemo(
        () => allProductsContainer.map((container) => container.id),
        [allProductsContainer]
    );
    const chosenProductsContainerId = useMemo(
        () => chosenProductsContainer.map((container) => container.id),
        [chosenProductsContainer]
    );


    const [activeContainer, setActiveContainer] = useState<ContainerType | null>(null);

    const [activeProduct, setActiveProduct] = useState<ProductType | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        })
    );

    useEffect(() => {
        turnDataIntoObject().then((res) => {
            if (res) setProducts(res);
        });
    }, []);

    useEffect(() => {
        if (hasClickedResetBtn) {
            turnDataIntoObject().then((res) => {
                if (res) setProducts(res);
            });

            setHasClickedResetBtn(false);
        }
    }, [hasClickedResetBtn]);

    useEffect(() => {
        setTotalSum(step1Sum + step2Sum);
    }, [step1Sum, step2Sum]);

    //! console.log('products', products); // Check why this renders twice

    if (!products.length) {
        return (
            <Loader imgSrc='<img width="800" height="490" src="https://www.financialplanning.co.il/wp-content/uploads/2023/02/לוגו-עם-אייקון-future-תכנון-פיננסי-1024x627.webp" class="attachment-large size-large wp-image-16239" alt="לוגו עם אייקון future תכנון פיננסי" srcset="https://www.financialplanning.co.il/wp-content/uploads/2023/02/לוגו-עם-אייקון-future-תכנון-פיננסי-1024x627.webp 1024w, https://www.financialplanning.co.il/wp-content/uploads/2023/02/לוגו-עם-אייקון-future-תכנון-פיננסי-300x184.webp 300w, https://www.financialplanning.co.il/wp-content/uploads/2023/02/לוגו-עם-אייקון-future-תכנון-פיננסי-768x471.webp 768w, https://www.financialplanning.co.il/wp-content/uploads/2023/02/לוגו-עם-אייקון-future-תכנון-פיננסי.webp 1508w" sizes="(max-width: 800px) 100vw, 800px" data-node-item="1676">' />
        );
    }

    const renderContainers = (container: ContainerType) => {
        return (
            <ProductList
                key={container.id}
                container={container}
                products={products.filter((product) => product.container === container.id)}
                setStep1Sum={setStep1Sum}
                setStep2Sum={setStep2Sum}
                className={`product-list-container${
                    container.id !== "allProductsContainer" ? " chosen-products-container" : ""
                }`}
            />
        );
    };

    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === "Container") {
            setActiveContainer(event.active.data.current.container);
            return;
        }

        if (event.active.data.current?.type === "Product") {
            setActiveProduct(event.active.data.current.product);
            return;
        }
    }

    function onDragEnd(event: DragEndEvent) {
        setActiveContainer(null);
        setActiveProduct(null);

        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;
        console.log("Just dragged: ", event.active.data.current?.product);
        if (activeId === overId) return;

        const isActiveAContainer = active.data.current?.type === "Container";
        if (!isActiveAContainer) return;

        console.log("DRAG END");

        setAllProductsContainer((allProductsContainer) => {
            const activeContainerIndex = allProductsContainer.findIndex((container) => container.id === activeId);

            const overContainerIndex = allProductsContainer.findIndex((container) => container.id === overId);

            return arrayMove(allProductsContainer, activeContainerIndex, overContainerIndex);
        });
    }

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveAProduct = active.data.current?.type === "Product";
        const isOverAProduct = over.data.current?.type === "Product";

        if (!isActiveAProduct) return;

        if (isActiveAProduct && isOverAProduct) {
            setProducts((products) => {
                const activeIndex = products.findIndex((product) => product.id === activeId);
                const overIndex = products.findIndex((product) => product.id === overId);

                if (products[activeIndex].container != products[overIndex].container) {
                    products[activeIndex].container = products[overIndex].container;
                    return arrayMove(products, activeIndex, overIndex - 1);
                }

                return arrayMove(products, activeIndex, overIndex);
            });
        }

        const isOverAContainer = over.data.current?.type === "Container";

        if (isActiveAProduct && isOverAContainer) {
            setProducts((products) => {
                const activeIndex = products.findIndex((product) => product.id === activeId);

                // console.log("overId:", overId);
                // console.log("products[activeIndex].container:", products[activeIndex].container);
                if (typeof overId === "string") {
                    products[activeIndex].container = overId;
                }
                // console.log("DROPPING TASK OVER COLUMN", { activeIndex });
                return arrayMove(products, activeIndex, activeIndex);
            });
        }
    }

    return (
        <main className="product-lists-main">
            <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
                <div className="product-lists-container">
                    <button className="reset-board-btn-wrapper" onClick={() => setHasClickedResetBtn(true)}>
                        <img src={refreshIcon} alt="refresh" />
                    </button>
                    <SortableContext items={allProductsContainerId}>
                        {allProductsContainer.map((container) => renderContainers(container))}
                    </SortableContext>
                    <div className="chosen-products-title-wrapper">
                        <h2>תהליך תכנון פיננסי</h2>
                        <div className="chosen-products-container">
                            <div className="chosen-products-wrapper">
                                <SortableContext items={chosenProductsContainerId}>
                                    {chosenProductsContainer.map((container) => renderContainers(container))}
                                </SortableContext>
                            </div>
                            <div className="products-total-sum">
                                <p>עלות כל התהליך: ₪{addCommasToNumber(totalSum)}</p>
                            </div>
                        </div>
                    </div>
                    <ExportButton />
                </div>

                {createPortal(
                    <DragOverlay>
                        {activeContainer && (
                            <ProductList
                                key={activeContainer.id}
                                container={activeContainer}
                                setStep1Sum={setStep1Sum}
                                setStep2Sum={setStep2Sum}
                                products={products.filter((product) => product.container === activeContainer.id)}
                            />
                        )}
                        {activeProduct && (
                            <Product key={activeProduct.id} product={activeProduct} className="product" />
                        )}
                        {/* {activeProduct && <Product product={activeProduct} updateProduct={updateProduct} />} */}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>
        </main>
    );
}

export default ProductListDashboard;
