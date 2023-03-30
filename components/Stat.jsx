const Stat = (props) => {
  const { title, primaryText, secondaryText, color } = props;
  return (
    <div className="column">
      <div style={{ fontSize: '1.3rem', color: color ?? 'rgb(224,186,161)' }}>
        {title}
      </div>
      <div
        style={{
          fontSize: '1.6rem',
          fontWeight: 'bolder',
          whiteSpace: 'pre-line',
        }}
      >
        {primaryText}
      </div>
      {secondaryText && <div>{secondaryText}</div>}
    </div>
  );
};

export default Stat;
