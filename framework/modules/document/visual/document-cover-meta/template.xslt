<?xml version='1.0' encoding='UTF-8'?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" version="1.0">
  <xsl:output method="xml" omit-xml-declaration="yes"/>
  <xsl:template match="/">
    <div class="document-cover-meta">
      <xsl:if test="/*/@term!='' or /*/@section!=''">
        <div class="document-cover-meta-item">
          <span class="document-cover-meta-label">Course offering</span>
          <span class="document-cover-meta-value">
            <xsl:if test="/*/@section!=''">Section <xsl:value-of select="/*/@section"/> · </xsl:if>
            <xsl:value-of select="/*/@term"/>
            <xsl:value-of select="/*/@year"/>
          </span>
        </div>
      </xsl:if>
      <xsl:if test="/*/@author!=''">
        <div class="document-cover-meta-item">
          <span class="document-cover-meta-label">Instructor</span>
          <span class="document-cover-meta-value">
            <xsl:value-of select="/*/@author"/>
          </span>
        </div>
      </xsl:if>
      <xsl:if test="/*/@date!=''">
        <div class="document-cover-meta-item">
          <span class="document-cover-meta-label">Date</span>
          <span class="document-cover-meta-value">
            <xsl:value-of select="/*/@date"/>
          </span>
        </div>
      </xsl:if>
      <xsl:if test="/*/@version!=''">
        <div class="document-cover-meta-item">
          <span class="document-cover-meta-label">Version</span>
          <span class="document-cover-meta-value">
            <xsl:value-of select="/*/@version"/>
          </span>
        </div>
      </xsl:if>
    </div>
  </xsl:template>
</xsl:stylesheet>
