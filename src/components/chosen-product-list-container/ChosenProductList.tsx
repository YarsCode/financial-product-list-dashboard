// import React, { useMemo } from "react";
// import Product from "../product/Product.tsx";
// import { SortableContext, useSortable } from "@dnd-kit/sortable";


// interface ChosenProductListProps {
//     chosenProducts: Product[];
// }

// const ChosenProductList: React.FC<ChosenProductListProps> = ({chosenProducts}) => {
//     const chosenProductsIds = useMemo(() => {
//         return chosenProducts?.map(chosenProduct => chosenProduct?.id)
//     }, [chosenProducts])
    
//     const {setNodeRef} = useSortable({
//         id: "droppable",
//         data: {
//             type: "ChosenListContainer",
//         },
//       });
    
//     return (
//         <ul ref={setNodeRef}>
//             <SortableContext items={chosenProductsIds}>
//                 {chosenProducts.map((chosenProduct) => (
//                     <Product id={chosenProduct.id} key={chosenProduct.id} name={chosenProduct.name} description={chosenProduct.description} price={chosenProduct.price} />
//                 ))}
//             </SortableContext>
//         </ul>
//     );
// };

// export default ChosenProductList;
