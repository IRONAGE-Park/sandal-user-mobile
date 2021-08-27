import { useState, useEffect, useMemo } from 'react';

export const useScroll = (loading) => {
    const [scrollTop, setScrollTop] = useState(0);
    const [scrollHeight, setScrollHeight] = useState(0);
    const [innerHeight, setInnerHeight] = useState(0);
    const [prevScroll, setPrevScroll] = useState(0);
    const isScrollEnd = useMemo(
        () => scrollHeight !== 0 && scrollHeight - innerHeight - scrollTop < 1,
        [scrollHeight, innerHeight, scrollTop],
    );
    const onScroll = () => {
        setInnerHeight(window.innerHeight);
        setScrollHeight(document.body.scrollHeight);
        setPrevScroll(scrollTop);
        const top =
            window.scrollY ||
            (document.documentElement && document.documentElement.scrollTop) ||
            document.body.scrollTop;
        if (!loading) {
            setScrollTop(top);
            sessionStorage.setItem('scrollTop', top);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', onScroll, false);

        return () => {
            window.removeEventListener('scroll', onScroll, false);
        };
    });

    return {
        scrollTop,
        scrollHeight,
        innerHeight,
        prevScroll,
        isScrollEnd,
    };
};

export const useDomScroll = ()=>{

    const [isScrollEnd,setScrollEnd] = useState(false);
    const [scrollTop, setScrollTop] = useState(0);
    const [scrollHeight, setScrollHeight] = useState(0);
    const [innerHeight, setInnerHeight] = useState(0);
    const [prevScroll, setPrevScroll] = useState(0);

    const onScroll =(e) =>{
        let scrollHeight = e.target.scrollHeight;
        let scrollTop = e.target.scrollTop;
        let clientHeight = e.target.clientHeight;
        let height  = scrollTop+clientHeight;
        sessionStorage.setItem('scroll_top',scrollTop);
        if(scrollHeight-100 <= height){
            setScrollEnd(true);
        }
        else{
            setScrollEnd(false);
        }
    } 

    return{
        onScroll,isScrollEnd
    }
}

export const useRestore =()=>{

    const restoreScroll = (dom) => {
        const scrollTop = sessionStorage.getItem('scroll_top');
        const url = JSON.parse(sessionStorage.getItem('url'));
        if (url) {
            //이전 주소가 상품페이지라면 스크롤 유지
            //여기 예외처리
            if (url.prev.indexOf('/product')!==-1) {
                if (dom) {
                    dom.scrollTo(0, scrollTop);
                }
            }
        }
    };
    const restoreOffset =(setOffset)=>{
        const url = JSON.parse(sessionStorage.getItem('url'));
        if (url) {
            //이전 페이지가 상품페이지라면 오프셋 유지.
            if (url.prev.indexOf('/product')!==-1) {
                const OS = sessionStorage.getItem('offset');
                if (OS) {
                    setOffset(parseInt(OS));
                }
            }
        }
    }
    return {
        restoreScroll ,restoreOffset
    };
}