import * as tmImage from '@teachablemachine/image';
import * as React from 'react';
import type PredictionResult from "../interfaces/PredictionResult";
import type BinaryNode from "../interfaces/BinaryNode";
import '../styles/ui.css';
import loadingCircle from "../assets/loadingCircle.svg";
import logo from "../assets/logo.png";
import styled from "styled-components";

declare function require(path: string): any;

const Conainer = styled("div")`
  width: 100%;
  height: 100%;
  background-color: rgb(44, 44, 44);
  color: #fff;
  font-size: 16px;
`

const Contents = styled("div")`
  padding: 20px;
`;

const Title = styled("div")`
  margin-bottom: 8px;
`;

const Logo = styled("div")`
  margin-bottom: 8px;
`

const LogoImage = styled("img")`
  width: 25%;
`

const App = ({}): JSX.Element => {
    //model URL
    const URL = "https://teachablemachine.withgoogle.com/models/7TY9ihr-l/";
    const modelURL = URL + 'model.json';
    const metadataURL = URL + 'metadata.json';
    // state
    const [isOnline, setIsOnline] = React.useState<boolean>(false);
    const [isModeloaded, setIsModeloaded] = React.useState<boolean>(false);
    const [isPredicting, setIsPredicting] = React.useState<boolean>(false);
    const [emptySelection, setEmptySelection] = React.useState<boolean>(false);
    const precision: number = 0.45;

    // onClick
    const handleClick = () => {
        setIsPredicting(true);
        parent.postMessage({ pluginMessage: { type: "clickPredictButton" } }, "*");
    };

    React.useEffect(() => {
        let model;
        const checkConnection = () => {
            const status = navigator.onLine ? true : false;
            setIsOnline(status);
        }
        const init = async () => {
            await tmImage.load(modelURL, metadataURL).then(customModel => {
                setIsModeloaded(true);
                model = customModel;
            });
        };
        const renderUint8ArrayToImage = async (bytes: Uint8Array): Promise<HTMLImageElement> => {
            const newImage = new Image(224, 224);
            const base64Data = btoa(String.fromCharCode.apply(null, bytes)); //No Buffer.from(bytes).toString('base64'); cause we are not in Node JS
            newImage.src = "data:image/png;base64," + base64Data;
            return newImage;
        };
        const predict = async (node: BinaryNode):Promise<PredictionResult>  => {
            const pixelImage: HTMLImageElement = await renderUint8ArrayToImage(node.imageDataBytes);
            const prediction: any[] = await model.predict(pixelImage);
            
            let sortedProbabilities = prediction.sort((a, b) => a.probability - b.probability);
            let finalist = sortedProbabilities[sortedProbabilities.length - 1];

            let predictedNode: PredictionResult;

            if (finalist.probability > precision) {
              predictedNode = {
                  nodeId : node.nodeId,
                  prediction : finalist.className
              }
            } else {
              predictedNode = {
                  nodeId : node.nodeId,
                  prediction : "Container"
              }
            }
            pixelImage.remove();
            return predictedNode;
        };
        checkConnection();
        init();
        window.onmessage = async (event) => {
          const {type, data} = event.data.pluginMessage || {};
          if (type === "emptySelection") {
            setEmptySelection(true);
          } else if (type === "processingRequest") {
            setEmptySelection(false);
            const binaryNodes: BinaryNode[] = data;
            let results: PredictionResult[] = [];
            //Prediction
            for (let node of binaryNodes) {
                const predictedNode: PredictionResult = await predict(node);
                results = [...results, predictedNode];
            }
            window.parent.postMessage({pluginMessage : {type : "response", payload : results}}, "*");
            setIsPredicting(false);
          }
        }
    }, []);

    if (!isOnline) {
        return <Conainer><Contents>now offline. please check your network.</Contents></Conainer>;
    }
    return (
        <Conainer>
          <Contents>
          <Title>
            {isModeloaded ? `Select layers and press "ReName Button"` : `Please wait the model loading`}
          </Title>
          <Logo>
            <LogoImage
              src={logo}
              alt="logo"
              />
          </Logo>
          {!isModeloaded ? (
            <>
              <img
                src={loadingCircle}
                alt="Loading circle"
                className="spin spin1"
              />
              Loading model...
            </>
          ) : emptySelection ? (
            <button
                className=""
                onClick={handleClick}
                >
                Please selects layers
            </button>
          ) : (<button
            onClick={handleClick}
          >{isPredicting ? `Processing...` : `ReName`}</button>)}
          </Contents>
        </Conainer>
    );
};

export default App;
