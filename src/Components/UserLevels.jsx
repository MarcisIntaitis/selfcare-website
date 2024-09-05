import '../Styles/UserLevels.css'
import UserInfo from './Hooks/UserInfo'
function ChallengeLevels() {
    const {level} = UserInfo()

    const getLevel = (currentLevel) => {
        return (
            currentLevel === level ? 'level-indicator active current' : currentLevel <= level ? 'level-indicator active' : 'level-indicator'
        )
    }

    const iconVis = (currentLevel) => {
        return (
            currentLevel > level ? 'icon icon-not-active' : 'icon'
        )
    }

    const starFill = (currentLevel) => {
        return(
            currentLevel < level ? <path d="m293-203.08 49.62-212.54-164.93-142.84 217.23-18.85L480-777.69l85.08 200.38 217.23 18.85-164.93 142.84L667-203.08 480-315.92 293-203.08Z"/> : <path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143Zm-43 59 45-192-149-129 196-17 77-181 77 181 196 17-149 129 45 192-169-102-169 102Zm169-242Z"/>
        )
    }

    return (
        <div className='level-container'>
            <div className={getLevel(1)}><svg className={iconVis(1)} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">{starFill(1)}</svg></div>
            <div className={getLevel(2)}><svg className={iconVis(2)} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">{starFill(2)}</svg></div>
            <div className={getLevel(3)}><svg className={iconVis(3)} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">{starFill(3)}</svg></div>
            <div className={getLevel(4)}><svg className={iconVis(4)} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">{starFill(4)}</svg></div>
            <div className={getLevel(5)}><svg className={iconVis(5)} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">{starFill(5)}</svg></div>
            <div className={getLevel(6)}><svg className={iconVis(6)} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">{starFill(6)}</svg></div>
        </div>
    )
}

export default ChallengeLevels
