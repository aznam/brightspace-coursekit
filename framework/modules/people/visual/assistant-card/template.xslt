<?xml version='1.0' encoding='UTF-8'?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:p="urn:coursekit:page"
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:mp="urn:coursekit:page:people"
    xmlns:ms="urn:coursekit:semantic:people"
    xmlns:mc="urn:coursekit:visual:people"
    version="1.0">
  <xsl:output method="xml" omit-xml-declaration="yes"/>
  <xsl:template match="/">
    <article class="ck-assistant-card">
      <div class="ck-assistant-card__profile">
        <div class="ck-assistant-card__banner"/>
        <div class="ck-assistant-card__photo">
          <xsl:if test="/*/@photo">
            <img alt="{/*/@name}"/>
          </xsl:if>
        </div>
        <div class="ck-assistant-card__identity">
          <div class="ck-assistant-card__role">
            <xsl:value-of select="/*/@role"/>
          </div>
          <h3 class="ck-assistant-card__name">
            <xsl:value-of select="/*/@name"/>
          </h3>
          <xsl:if test="/*/@title">
            <div class="ck-assistant-card__title">
              <xsl:value-of select="/*/@title"/>
            </div>
          </xsl:if>
          <xsl:if test="/*/@email">
            <div class="ck-assistant-card__email">
              <strong>Email: </strong>
              <a class="ck-assistant-card__email-link" href="mailto:{/*/@email}">
                <xsl:value-of select="/*/@email"/>
              </a>
            </div>
          </xsl:if>
          <xsl:if test="/*/mp:office-hours">
            <div class="ck-assistant-card__hours">
              <xsl:for-each select="/*/mp:office-hours">
                <div class="ck-assistant-card__hour">
                  <strong>
                    <xsl:value-of select="@location"/>
                  </strong>
                  <p>
                    <xsl:value-of select="."/>
                  </p>
                  <xsl:if test="@directions-url">
                    <a class="ck-assistant-card__directions" href="{@directions-url}" target="_blank" rel="noopener noreferrer">📍 Get Directions</a>
                  </xsl:if>
                </div>
              </xsl:for-each>
            </div>
          </xsl:if>
          <xsl:if test="/*/@online-hours">
            <p class="ck-assistant-card__online">💻 <strong>Online: </strong><xsl:value-of select="/*/@online-hours"/></p>
          </xsl:if>
          <xsl:if test="/*/@variant='compact' and /*/mp:person-description">
            <p class="ck-assistant-card__help-hint">Hover over the photo to see how I can help you</p>
          </xsl:if>
        </div>
        <xsl:if test="/*/mp:person-description">
          <button type="button" class="ck-assistant-card__trigger" aria-expanded="false"><xsl:attribute name="aria-label">Read more about <xsl:value-of select="/*/@name"/></xsl:attribute>›</button>
          <div class="ck-assistant-card__drawer" aria-hidden="true">
            <strong class="ck-assistant-card__drawer-title">
              <xsl:value-of select="/*/mp:person-description/@title"/>
            </strong>
            <div class="ck-assistant-card__drawer-body"/>
          </div>
        </xsl:if>
      </div>
      <xsl:if test="/*/@booking-url or /*/@email">
        <div class="ck-assistant-card__actions">
          <xsl:if test="/*/@booking-url">
            <a class="ck-assistant-card__action ck-assistant-card__action--primary" href="{/*/@booking-url}" target="_blank" rel="noopener noreferrer">
              <xsl:choose>
                <xsl:when test="/*/@variant='compact'">📅 Book</xsl:when>
                <xsl:otherwise>📅 Book an Appointment</xsl:otherwise>
              </xsl:choose>
            </a>
          </xsl:if>
          <xsl:if test="/*/@email">
            <a class="ck-assistant-card__action ck-assistant-card__action--secondary" href="mailto:{/*/@email}">
              <xsl:choose>
                <xsl:when test="/*/@variant='compact'">📧 Email</xsl:when>
                <xsl:otherwise>📧 Send an Email</xsl:otherwise>
              </xsl:choose>
            </a>
          </xsl:if>
        </div>
      </xsl:if>
    </article>
  </xsl:template>
</xsl:stylesheet>
