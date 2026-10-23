<?xml version='1.0' encoding='UTF-8'?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" version="1.0">
  <xsl:output method="xml" omit-xml-declaration="yes"/>
  <xsl:template match="/">
    <div class="document-cover-brand">
      <xsl:if test="/*/@logo!=''">
        <img class="document-cover-logo" src="{/*/@logo}" alt="Institution logo"/>
      </xsl:if>
      <div class="document-cover-institution">
        <xsl:if test="/*/@institution!=''">
          <strong>
            <xsl:value-of select="/*/@institution"/>
          </strong>
        </xsl:if>
        <xsl:if test="/*/@faculty!=''">
          <div>
            <xsl:value-of select="/*/@faculty"/>
          </div>
        </xsl:if>
        <xsl:if test="/*/@department!=''">
          <div>
            <xsl:value-of select="/*/@department"/>
          </div>
        </xsl:if>
      </div>
      <hr class="document-cover-rule"/>
      <div class="document-cover-course">
        <xsl:value-of select="/*/@code"/>
        <div class="document-cover-course-title">
          <xsl:value-of select="/*/@course"/>
        </div>
        <xsl:if test="/*/@program!=''">
          <div class="document-cover-program">
            <xsl:value-of select="/*/@program"/>
          </div>
        </xsl:if>
      </div>
    </div>
  </xsl:template>
</xsl:stylesheet>