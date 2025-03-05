import React from "react"
import { useEditor } from "@layerhub-io/react"
import { Block } from "baseui/block"
import { loadFonts } from "~/utils/fonts"
import Scrollable from "~/components/Scrollable"
import AngleDoubleLeft from "~/components/Icons/AngleDoubleLeft"
import { useStyletron } from "baseui"
import useSetIsSidebarOpen from "~/hooks/useSetIsSidebarOpen"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"

export default function () {
  const editor = useEditor()
  const setIsSidebarOpen = useSetIsSidebarOpen()
  const { setCurrentScene, currentScene } = useDesignEditorContext()
  const [products, setProducts] = React.useState<any[]>([])
  const [css] = useStyletron()

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://dash.brandexperts.ae/dash/product-basic-details/"
        )
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }
    fetchProducts()
  }, [])

  const loadTemplate = React.useCallback(
    async (product: any) => {
      if (editor) {
        const template = {
          id: product.id,
          name: product.name,
          layers: [
            {
              id: "background",
              name: "Initial Frame",
              angle: 0,
              stroke: null,
              strokeWidth: 0,
              left: 0,
              top: 0,
              width: parseFloat(product.max_width),
              height: parseFloat(product.max_height),
              opacity: 1,
              originX: "left",
              originY: "top",
              scaleX: 1,
              scaleY: 1,
              type: "Background",
              flipX: false,
              flipY: false,
              skewX: 0,
              skewY: 0,
              visible: true,
              shadow: null,
              fill: "#ffffff",
            },
          ],
          frame: {
            width: parseFloat(product.max_width),
            height: parseFloat(product.max_height),
          },
          preview: product.image1,
          metadata: {
            animated: false,
          },
        }
        setCurrentScene({ ...template, id: currentScene?.id })
      }
    },
    [editor, currentScene, setCurrentScene]
  )

  return (
    <Block $style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Block
        $style={{
          display: "flex",
          alignItems: "center",
          fontWeight: 500,
          justifyContent: "space-between",
          padding: "1.5rem",
        }}
      >
        <Block>Products</Block>
        <Block
          onClick={() => setIsSidebarOpen(false)}
          $style={{ cursor: "pointer", display: "flex" }}
        >
          <AngleDoubleLeft size={18} />
        </Block>
      </Block>
      <Scrollable>
        <div className={css({ padding: "0 1.5rem" })}>
          <div
            className={css({
              display: "grid",
              gap: "0.5rem",
              gridTemplateColumns: "1fr 1fr",
            })}
          >
            {products.map((product, index) => {
              const sizeUnit = product.size === "Centimeter" ? "cm" : "m"
              const dimensions = `${product.max_width}${sizeUnit} × ${product.max_height}${sizeUnit}`
              
              return (
                <ProductItem
                  key={index}
                  preview={`${product.image1}?tr=w-320`}
                  name={product.name}
                  size={dimensions}
                  onClick={() => loadTemplate(product)}
                />
              )
            })}
          </div>
        </div>
      </Scrollable>
    </Block>
  )
}

function ProductItem({
  preview,
  name,
  size,
  onClick,
}: {
  preview: string
  name: string
  size: string
  onClick: () => void
}) {
  const [css] = useStyletron()

  return (
    <div
      onClick={onClick}
      className={css({
        position: "relative",
        background: "#f8f8fb",
        cursor: "pointer",
        borderRadius: "8px",
        overflow: "hidden",
        transition: "transform 0.2s ease",
        ":hover": {
          transform: "translateY(-2px)",
        },
      })}
    >
      {/* Image Container */}
      <div
        className={css({
          position: "relative",
          height: "160px",
          overflow: "hidden",
        })}
      >
        <img
          src={preview}
          className={css({
            width: "100%",
            height: "100%",
            objectFit: "cover",
            verticalAlign: "middle",
          })}
          alt={name}
        />

        {/* Gradient Overlay */}
        <div
          className={css({
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "60%",
            background:
              "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)",
          })}
        />
      </div>

      {/* Product Info */}
      <div
        className={css({
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "12px",
          color: "#ffffff",
        })}
      >
        <div
          className={css({
            fontSize: "14px",
            fontWeight: 500,
            lineHeight: "1.25",
            marginBottom: "4px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          })}
        >
          {name}
        </div>
        <div
          className={css({
            fontSize: "12px",
            opacity: 0.9,
          })}
        >
          {size}
        </div>
      </div>
    </div>
  )
}